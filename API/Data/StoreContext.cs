using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// DbContext is actually a combination of Repository and Unit of Work patterns
public class StoreContext(DbContextOptions options) : DbContext(options)
{
  public required DbSet<Product> Products { get; set; }
}
