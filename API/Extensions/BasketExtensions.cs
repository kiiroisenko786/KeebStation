using System;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class BasketExtensions
{
  // Method to convert a Basket entity to a BasketsDto
  public static BasketDto ToDto(this Basket basket)
  {
    return new BasketDto
    {
      BasketId = basket.BasketId,
      ClientSecret = basket.ClientSecret,
      PaymentIntentId = basket.PaymentIntentId,
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

  public static async Task<Basket> GetBasketWithItems(this IQueryable<Basket> query, string? basketId)
  {
    // Double question mark operator (??) is used to provide a default value if query is null
    return await query
      .Include(x => x.Items)
      .ThenInclude(x => x.Product)
      .FirstOrDefaultAsync(x => x.BasketId == basketId) ?? throw new Exception("Cannot get basket");
  }
}
