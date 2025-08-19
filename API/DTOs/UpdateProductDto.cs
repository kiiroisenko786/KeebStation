using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProductDto
{
  public int Id { get; set; }

  [Required]
  public string Name { get; set; } = string.Empty;

  [Required]
  public string Description { get; set; } = string.Empty;

  // 1 = £0.01 -> infinity
  [Required]
  [Range(1, double.PositiveInfinity)]
  public long Price { get; set; }

  // File is optional when updating, required otherwise when creating
  public IFormFile? File { get; set; }

  [Required]
  public required string Type { get; set; }

  [Required]
  public required string Brand { get; set; }
  
  [Required]
  [Range(1, int.MaxValue)]
  public required int QuantityInStock { get; set; }
}
