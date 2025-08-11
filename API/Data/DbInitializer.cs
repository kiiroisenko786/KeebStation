using System;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DbInitializer
{
  public static async Task InitDb(WebApplication app)
  {
    // Get access to services, dotnet will clean up after the scope is disposed
    using var scope = app.Services.CreateScope();

    // Get access to store context
    // ?? conditional is if the context is null
    var context = scope.ServiceProvider.GetRequiredService<StoreContext>()
      ?? throw new InvalidOperationException("Failed to get StoreContext");

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>()
      ?? throw new InvalidOperationException("Failed to get UserManager");

    await SeedData(context, userManager);
  }

  private static async Task SeedData(StoreContext context, UserManager<User> userManager)
  {
    context.Database.Migrate();

    if (!userManager.Users.Any())
    {
      var user = new User
      {
        // Create user with email as username so we can use it for login
        UserName = "bob@test.com",
        Email = "bob@test.com"
      };

      await userManager.CreateAsync(user, "Pa$$w0rd");
      await userManager.AddToRoleAsync(user, "Member");

      var admin = new User
      {
        // Create admin with email as username so we can use it for login
        UserName = "admin@test.com",
        Email = "admin@test.com"
      };

      await userManager.CreateAsync(admin, "Pa$$w0rd");
      await userManager.AddToRolesAsync(admin, ["Member", "Admin"]);
    }

    // Check is we already have products in the Store context
    if (context.Products.Any()) return;

    var products = new List<Product>
    {
      new Product
      {
        Name = "GMMK Pro Mechanical Keyboard",
        Description = "A premium 75% mechanical keyboard with a CNC aluminum case, hot-swappable keys, and per-key RGB lighting.",
        Price = 16999,
        ImageUrl = "/images/products/keyboard-gmmkpro.png",
        Brand = "Glorious",
        Type = "Keyboards",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Keychron K6 Wireless Mechanical Keyboard",
        Description = "Compact 65% wireless mechanical keyboard with hot-swappable keys and multi-device connectivity.",
        Price = 7499,
        ImageUrl = "/images/products/keyboard-k6.png",
        Brand = "Keychron",
        Type = "Keyboards",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Drop CTRL Mechanical Keyboard",
        Description = "A tenkeyless keyboard with an aluminum frame, hot-swap sockets, and customizable RGB lighting.",
        Price = 19900,
        ImageUrl = "/images/products/keyboard-dropctrl.png",
        Brand = "Drop",
        Type = "Keyboards",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Ducky One 3 Mini RGB Keyboard",
        Description = "60% form factor keyboard with bright RGB lighting, double-shot PBT keycaps, and high-quality stabilizers.",
        Price = 11999,
        ImageUrl = "/images/products/keyboard-duckyone3.png",
        Brand = "Ducky",
        Type = "Keyboards",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Leopold FC660C Topre Keyboard",
        Description = "Topre switch keyboard with electro-capacitive keys and exceptional build quality, in a 65% layout.",
        Price = 24999,
        ImageUrl = "/images/products/keyboard-leopold.png",
        Brand = "Leopold",
        Type = "Keyboards",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Akko 3068B Plus Wireless Mechanical Keyboard",
        Description = "68-key keyboard with PBT keycaps, wireless connectivity, and hot-swappable switches.",
        Price = 8999,
        ImageUrl = "/images/products/keyboard-akko3068.png",
        Brand = "Akko",
        Type = "Keyboards",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "GMK Red Samurai Keycap Set",
        Description = "High-quality double-shot ABS keycap set inspired by traditional samurai aesthetics.",
        Price = 12999,
        ImageUrl = "/images/products/keycaps-redsamurai.png",
        Brand = "GMK",
        Type = "Keycaps",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "MT3 Serika Keycap Set",
        Description = "A sculpted MT3 profile keycap set with retro aesthetics and dye-sublimated legends.",
        Price = 11999,
        ImageUrl = "/images/products/keycaps-serika.png",
        Brand = "Drop",
        Type = "Keycaps",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "ePBT Kavala Keycap Set",
        Description = "Beautifully designed PBT keycap set in ePBT profile with clean, modern aesthetics.",
        Price = 9999,
        ImageUrl = "/images/products/keycaps-kavala.png",
        Brand = "ePBT",
        Type = "Keycaps",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Cherry MX Red Switches (10 pack)",
        Description = "Smooth linear mechanical switches with low actuation force, perfect for gaming.",
        Price = 699,
        ImageUrl = "/images/products/switches-mxred.png",
        Brand = "Cherry",
        Type = "Switches",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Gateron Brown Switches (10 pack)",
        Description = "Tactile mechanical switches that offer a soft bump, suitable for both typing and gaming.",
        Price = 599,
        ImageUrl = "/images/products/switches-gateronbrown.png",
        Brand = "Gateron",
        Type = "Switches",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Holy Panda X Switches (10 pack)",
        Description = "Highly tactile switches with a satisfying bump, known for their premium feel.",
        Price = 1199,
        ImageUrl = "/images/products/switches-holypanda.png",
        Brand = "Drop",
        Type = "Switches",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Kailh Box Jade Switches (10 pack)",
        Description = "Clicky mechanical switches with a crisp, loud tactile bump and excellent durability.",
        Price = 899,
        ImageUrl = "/images/products/switches-boxjade.png",
        Brand = "Kailh",
        Type = "Switches",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Deskmat - Spellbook Beige",
        Description = "Deskmat featuring a beige, arcane/magic theme, stitched edges, and anti-slip rubber base.",
        Price = 2499,
        ImageUrl = "/images/products/deskmat-spellbookbeige.png",
        Brand = "NovelKeys",
        Type = "Accessories",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Deskmat - GMK Botanical",
        Description = "Elegant deskmat with a soothing green botanical design and smooth cloth surface.",
        Price = 2299,
        ImageUrl = "/images/products/deskmat-botanical.png",
        Brand = "NovelKeys",
        Type = "Accessories",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Keyboard Lube Station Plus Kit",
        Description = "Complete set for lubing your mechanical switches, includes stem holder, brushes and tweezers.",
        Price = 1999,
        ImageUrl = "/images/products/tool-lubestationplus.png",
        Brand = "KBDfans",
        Type = "Tools",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Switch Puller Tool - Premium Steel",
        Description = "High-quality stainless steel switch puller for safely removing mechanical switches.",
        Price = 999,
        ImageUrl = "/images/products/tool-switchpuller.png",
        Brand = "KBDfans",
        Type = "Tools",
        QuantityInStock = 100
      },
      new Product
      {
        Name = "Keycap Puller Tool - Wire",
        Description = "Durable wire keycap puller for easily removing keycaps without damage.",
        Price = 699,
        ImageUrl = "/images/products/tool-keycappuller.png",
        Brand = "KBDfans",
        Type = "Tools",
        QuantityInStock = 100
      }
    };

    context.Products.AddRange(products);

    context.SaveChanges();
  }
}
