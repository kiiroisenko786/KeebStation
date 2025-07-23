using System;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

// This shippingaddress will not have its own table in the database
// it will be in line with an order
[Owned]
public class ShippingAddress
{
  public required string Name { get; set; }
  public required string Line1 { get; set; }
  public string? Line2 { get; set; }
  public required string City { get; set; }
  public required string State { get; set; }

  // Make sure to use the correct JSON property name for serialization (for stripe)
  // Because the C# conventional format is PostCode but stripe uses postal_code
  [JsonPropertyName("postal_code")]
  public required string PostCode { get; set; }
  public required string Country { get; set; }
}
