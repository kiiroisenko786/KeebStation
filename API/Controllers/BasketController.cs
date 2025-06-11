using System;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController(StoreContext context) : BaseApiController
{
  [HttpGet]
  public async Task<ActionResult<Basket>> GetBasket()
  {
    var basket = await RetrieveBasket();

    if (basket == null) return NoContent();

    return basket;
  }

  [HttpPost]
  public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
  {
    // get basket
    var basket = await RetrieveBasket();

    // create basket if it doesn't exist
    // double question mark checks for null (then set it equal to the result of the method)
    basket ??= CreateBasket();

    // get product from db
    var product = await context.Products.FindAsync(productId);
    if (product == null) return BadRequest("Problem adding item to basket");

    // add item to basket
    basket.AddItem(product, quantity);

    // save changes, > 0 is because SaveChangesAsync returns the number of state entries written to the database
    // if the result is greater than 0, it means the changes were saved successfully
    var result = await context.SaveChangesAsync() > 0;

    if (result) return CreatedAtAction(nameof(GetBasket), basket);

    return BadRequest("Problem updating basket");
  }


  [HttpDelete]
  public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
  {
    // get basket

    // remove item from basket or reduce quantity

    // save changes
  }

  public async Task<Basket?> RetrieveBasket()
  {
    return await context.Baskets
      .Include(x => x.Items)
      .ThenInclude(x => x.Product)
      .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["basketId"]);
  }

  private Basket CreateBasket()
  {
    var basketId = Guid.NewGuid().ToString();
    var cookieOptions = new CookieOptions
    {
      IsEssential = true,
      Expires = DateTime.UtcNow.AddDays(30)
    };

    Response.Cookies.Append("basketId", basketId, cookieOptions);
    var basket = new Basket { BasketId = basketId };
    context.Baskets.Add(basket);

    return basket;
  }
}
