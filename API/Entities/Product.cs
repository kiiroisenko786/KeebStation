using System;

namespace API.Entities;

public class Product
{
  public int Id { get; set; }
  public required string Name { get; set; }
  public required string Description { get; set; }
  public long Price { get; set; }
  public required string ImageUrl { get; set; }
  public required string Type { get; set; }
  public required string Brand { get; set; }
  public required int QuantityInStock { get; set; }
}
