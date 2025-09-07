using API.Data;
using API.Entities;
using API.Middleware;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt => 
{
    // Get connection string - prioritize DATABASE_URL for production (Render.com)
    var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
    
    // If DATABASE_URL is not set, fall back to configuration
    if (string.IsNullOrEmpty(connectionString))
    {
        connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    }
    
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Database connection string not found. Please set DATABASE_URL environment variable or configure DefaultConnection.");
    }
    
    // Parse DATABASE_URL if it's in the format postgresql://user:password@host:port/dbname
    if (connectionString.StartsWith("postgresql://"))
    {
        try
        {
            var uri = new Uri(connectionString);
            var host = uri.Host;
            var port = uri.Port > 0 ? uri.Port : 5432;
            var database = uri.AbsolutePath.TrimStart('/');
            
            // Parse username and password from UserInfo
            string username = "";
            string password = "";
            
            if (!string.IsNullOrEmpty(uri.UserInfo))
            {
                var userInfoParts = uri.UserInfo.Split(':');
                username = userInfoParts[0];
                if (userInfoParts.Length > 1)
                {
                    password = userInfoParts[1];
                }
            }
            
            connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing DATABASE_URL: {ex.Message}");
            Console.WriteLine($"Original connection string: {connectionString}");
            throw new InvalidOperationException($"Invalid DATABASE_URL format: {ex.Message}", ex);
        }
    }
    
    Console.WriteLine($"Using connection string: {connectionString.Replace(connectionString.Split("Password=")[1].Split(";")[0], "***")}");
    
    opt.UseNpgsql(connectionString);
});
builder.Services.AddCors();
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddScoped<PaymentsService>();
builder.Services.AddScoped<ImageService>();
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();

// Add AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:3000");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>(); // api/login
app.MapFallbackToController("Index", "Fallback");

await DbInitializer.InitDb(app);

app.Run();