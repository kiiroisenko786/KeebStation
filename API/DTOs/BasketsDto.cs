using System;

namespace API.DTOs;

public class BasketsDto
{
  public required string BasketId { get; set; }
  public List<BasketItemDto> Items { get; set; } = [];
}
