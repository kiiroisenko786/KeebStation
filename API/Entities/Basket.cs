using System;

namespace API.Entities;

public class Basket
{
  public int Id { get; set; }
  // BasketId will be used as a cookie to persist the basket across sessions
  public required string BasketId { get; set; }
  public List<BasketItem> Items { get; set; } = [];
  public string? ClientSecret { get; set; }

  // PaymentIntentId is used to track the payment intent for this basket
  public string? PaymentIntentId { get; set; }

  public void AddItem(Product product, int Quantity)
  {
    if (product == null) ArgumentNullException.ThrowIfNull(product);
    if (Quantity <= 0) throw new ArgumentException("Quantity must be greater than zero.", nameof(Quantity));

    var existingItem = FindItem(product.Id);

    if (existingItem == null)
    {
      Items.Add(new BasketItem
      {
        Product = product,
        Quantity = Quantity
      });
    }
    else
    {
      existingItem.Quantity += Quantity;
    }
  }

  public void RemoveItem(int productId, int Quantity)
  {
    if (Quantity <= 0) throw new ArgumentException("Quantity must be greater than zero.", nameof(Quantity));

    var item = FindItem(productId);
    if (item == null) return;

    item.Quantity -= Quantity;
    if (item.Quantity <= 0) Items.Remove(item);
  }

  // Will return a basketitem if it exists, or null if it does not
  private BasketItem? FindItem(int productId)
  {
    return Items.FirstOrDefault(item => item.ProductId == productId);
  }
}
