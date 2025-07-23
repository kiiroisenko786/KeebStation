using System;

namespace API.DTOs;

public class OrderItemDto
{
  public int ProductId { get; set; }
  public required string Name { get; set; }
  public required string ImageUrl { get; set; }
  public long Price { get; set; }
  public int Quantity { get; set; }
}
