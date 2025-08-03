using API.Entities;
using Stripe;

namespace API.Services;

public class PaymentsService(IConfiguration config)
{
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
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryFee
            };
            
            try
            {
                intent = await service.UpdateAsync(basket.PaymentIntentId, options);
            }
            catch (StripeException ex) when (ex.StripeError?.Code == "payment_intent_unexpected_state")
            {
                // If we can't update the existing payment intent, create a new one
                var createOptions = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,
                    Currency = "gbp",
                    PaymentMethodTypes = ["card"]
                };
                intent = await service.CreateAsync(createOptions);
                
                // Clear the old payment intent data from the basket
                basket.PaymentIntentId = null;
                basket.ClientSecret = null;
            }
        }

        return intent;
    }
}
