using System;
using API.Entities;

namespace API.Extensions;

public static class ProductExtensions
{
  public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
  {
    query = orderBy switch
    {
      // low to high price
      "price" => query.OrderBy(p => p.Price),
      // high to low
      "priceDesc" => query.OrderByDescending(p => p.Price),
      // default order by name, _ is default param
      _ => query.OrderBy(p => p.Name)
    };

    return query;
  }

  public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
  {
    if (string.IsNullOrEmpty(searchTerm)) return query;

    var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

    return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
  }

  public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brands, string? types)
  {
    var brandList = new List<string>();
    var typeList = new List<string>();

    if (!string.IsNullOrEmpty(brands))
    {
      brandList.AddRange(brands.ToLower().Split(",").ToList());
    }

    if (!string.IsNullOrEmpty(types))
    {
      typeList.AddRange(types.ToLower().Split(",").ToList());
    }

    query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
    query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

    return query;
  }
}
