using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;

public class PaymentsController(PaymentsService paymentsService, StoreContext context, IConfiguration config, ILogger<PaymentsController> logger) : BaseApiController
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

  // What stripe will use to call back to our API
  [HttpPost("webhook")]
  public async Task<IActionResult> StripeWebhook()
  {
    var json = await new StreamReader(Request.Body).ReadToEndAsync();

    try
    {
      var stripeEvent = ConstructStripeEvent(json);

      if (stripeEvent.Data.Object is not PaymentIntent intent)
      {
        return BadRequest("Invalid event data");
      }

      if (intent.Status == "succeeded") await HandlePaymentIntentSucceeded(intent);
      else await HandlePaymentIntentFailed(intent);

      return Ok();
    }
    catch (StripeException ex)
    {
      logger.LogError(ex, "Error processing Stripe webhook");
      return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Unexpected error processing Stripe webhook");
      return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error");
    }
  }

  private async Task HandlePaymentIntentFailed(PaymentIntent intent)
  {
    var order = await context.Orders
      .Include(x => x.OrderItems)
      .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
      ?? throw new Exception("Order not found");

    foreach (var item in order.OrderItems)
    {
      var productItem = await context.Products.FindAsync(item.ItemOrdered.ProductId)
        ?? throw new Exception("Problem updating product stock");

      productItem.QuantityInStock += item.Quantity;
    }

    order.OrderStatus = OrderStatus.PaymentFailed;
    await context.SaveChangesAsync();
  }

  private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
  {
    var order = await context.Orders
      .Include(x => x.OrderItems)
      .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
      ?? throw new Exception("Order not found");

    if (order.getTotal() != intent.Amount)
    {
      order.OrderStatus = OrderStatus.PaymentMismatch;
    }
    else
    {
      order.OrderStatus = OrderStatus.PaymentReceived;
    }

    var basket = await context.Baskets.FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id);

    if (basket != null) context.Baskets.Remove(basket);

    await context.SaveChangesAsync();
  }

  private Event ConstructStripeEvent(string json)
  {
    try
    {
      return EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], config["StripeSettings:WhSecret"]);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Failed to construct Stripe event");
      throw new StripeException("Invalid signature");
    }
  }
}
