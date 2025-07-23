using System;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

// Will be owned by order item
[Owned]
public class ProductItemOrdered
{
  public int ProductId { get; set; }
  public required string Name { get; set; }
  public required string ImageUrl { get; set; }
}
