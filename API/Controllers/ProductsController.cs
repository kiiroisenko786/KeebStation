using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  // No need to make a ctor, we can just inject like this
  public class ProductsController(StoreContext context) : BaseApiController
  {
    [HttpGet]
    // FromQuery tells the api controller looks for the search parameters in the query string
    public async Task<ActionResult<List<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
      var query = context.Products.Sort(productParams.OrderBy).Search(productParams.SearchTerm).Filter(productParams.Brands, productParams.Types).AsQueryable();

      // Get products as paged list
      var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

      Response.AddPaginationHeader(products.Metadata);

      // Return the products along with pagination metadata
      return products;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
      var product = await context.Products.FindAsync(id);

      if (product == null) return NotFound();

      return product;
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
      var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync();
      var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();

      return Ok(new { brands, types });
    }
  }
}
