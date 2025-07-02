using API.Entities;
using Stripe;

namespace API.Services;

public class PaymentsService(IConfiguration config)
{
  // PaymentIntent is how much the user is intending to pay
  public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
  {
    StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

    var service = new PaymentIntentService();

    var intent = new PaymentIntent();
    var subtotal = basket.Items.Sum(x => x.Quantity * x.Product.Price);
    var deliveryFee = subtotal > 10000 ? 0 : 599;

    if (string.IsNullOrEmpty(basket.PaymentIntentId))
    {
      var options = new PaymentIntentCreateOptions
      {
        Amount = subtotal + deliveryFee,
        Currency = "gbp",
        PaymentMethodTypes = ["card"]
      };

      intent = await service.CreateAsync(options);
    }
    else
    {
      // If we're updating a payment intent
      var options = new PaymentIntentUpdateOptions
      {
        Amount = subtotal + deliveryFee
      };

      await service.UpdateAsync(basket.PaymentIntentId, options);
    }

    return intent;
  }
}
