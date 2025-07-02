using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
  opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Add CORS policy
builder.Services.AddCors();
// Inject the exception handling middleware so we can use the logger and environment
builder.Services.AddTransient<ExceptionMiddleware>();

// Register PaymentsService
builder.Services.AddScoped<PaymentsService>();

// Add Identity services
builder.Services.AddIdentityApiEndpoints<User>(options =>
{
  options.User.RequireUniqueEmail = true;
}).AddRoles<IdentityRole>().AddEntityFrameworkStores<StoreContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// Add exception middleware to http request pipeline, at the top because any middleware can throw exceptions and it'll go up the middleware pipeline until something catches it
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(opt =>
{
  // Allow any header and method, and specify the allowed origin and credentials to send cookies
  opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:3000");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();

DbInitializer.InitDb(app);

app.Run();
