using System;
using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class BasketExtensions
{
  // Method to convert a Basket entity to a BasketsDto
  public static BasketsDto ToDto(this Basket basket)
  {
    return new BasketsDto
    {
      BasketId = basket.BasketId,
      Items = basket.Items.Select(x => new BasketItemDto
      {
        ProductId = x.ProductId,
        Name = x.Product.Name,
        Price = x.Product.Price,
        Brand = x.Product.Brand,
        Type = x.Product.Type,
        ImageUrl = x.Product.ImageUrl,
        Quantity = x.Quantity
      }).ToList()
    };
  }
}
