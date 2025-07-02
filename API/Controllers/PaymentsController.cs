using System;
using API.Data;
using API.DTOs;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PaymentsController(PaymentsService paymentsService, StoreContext context) : BaseApiController
{
  [Authorize]
  [HttpPost]
  public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
  {
    var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);

    if (basket == null) return BadRequest("Problem with the basket");

    var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);

    if (intent == null) return BadRequest("Problem creating the payment intent");

    // ??= operator is used to assign a value to a variable only if that variable is currently null
    basket.PaymentIntentId ??= intent.Id;
    basket.ClientSecret ??= intent.ClientSecret;

    if (context.ChangeTracker.HasChanges())
    {
      var result = await context.SaveChangesAsync() > 0;

      if (!result) return BadRequest("Problem updating the basket with payment intent");
    }

    return basket.ToDto();
  }
}
