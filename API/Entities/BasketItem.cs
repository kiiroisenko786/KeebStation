using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

// Change table name
[Table("BasketItems")]
public class BasketItem
{
  public int Id { get; set; }
  public int Quantity { get; set; }

  // Navigation properties
  public int ProductId { get; set; }
  public required Product Product { get; set; }

  // Fully define relationship between BasketItem and Basket by adding equivalent navigation property
  public int BasketId { get; set; }

  // Use ! to override the nullability of Basket property
  public Basket Basket { get; set; } = null!;
}