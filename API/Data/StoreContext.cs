using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// DbContext is actually a combination of Repository and Unit of Work patterns
public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
  public required DbSet<Product> Products { get; set; }
  public required DbSet<Basket> Baskets { get; set; }

  // Seed some roles
  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);

    builder.Entity<IdentityRole>().HasData(
      new IdentityRole { Id = "205ef2d7-d003-4f1c-83cd-b7769bfaec01", Name = "Member", NormalizedName = "MEMBER" },
      new IdentityRole { Id = "089dfdd5-5a27-4f12-9027-ac1953539a8b", Name = "Admin", NormalizedName = "ADMIN" }
    );
  }
}
