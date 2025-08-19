using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  // No need to make a ctor, we can just inject like this
  public class ProductsController(StoreContext context, IMapper mapper, ImageService imageService) : BaseApiController
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

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
    {
      // <What you want to map into>(<what you want to map from>)
      var product = mapper.Map<Product>(productDto);

      if (productDto.File != null)
      {
        var imageResult = await imageService.AddImageAsync(productDto.File);

        if (imageResult.Error != null)
        {
          return BadRequest(imageResult.Error.Message);
        }

        product.ImageUrl = imageResult.SecureUrl.AbsoluteUri;
        product.PublicId = imageResult.PublicId;
      }

      context.Products.Add(product);

      var result = await context.SaveChangesAsync() > 0;

      if (result) return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);

      return BadRequest("Problem creating new product");
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult> UpdateProduct(UpdateProductDto updateProductDto)
    {
      var product = await context.Products.FindAsync(updateProductDto.Id);

      if (product == null) return NotFound();

      // (Map from, map to) because it's updating the update dto into the product
      mapper.Map(updateProductDto, product);

      if (updateProductDto.File != null)
      {
        var imageResult = await imageService.AddImageAsync(updateProductDto.File);

        if (imageResult.Error != null)
        {
          return BadRequest(imageResult.Error.Message);
        }

        if (!string.IsNullOrEmpty(product.PublicId))
        {
          await imageService.DeleteImageAsync(product.PublicId);
        }

        product.ImageUrl = imageResult.SecureUrl.AbsoluteUri;
        product.PublicId = imageResult.PublicId;
      }

      var result = await context.SaveChangesAsync() > 0;

      if (result) return NoContent();

      return BadRequest("Problem updating product");
    }

    // Need id for delete because we aren't mapping anything, so can't get it from dto
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
      var product = await context.Products.FindAsync(id);

      if (product == null) return NotFound();

      if (!string.IsNullOrEmpty(product.PublicId))
        {
          await imageService.DeleteImageAsync(product.PublicId);
        }

      context.Products.Remove(product);

      var result = await context.SaveChangesAsync() > 0;

      if (result) return Ok();

      return BadRequest("Problem deleting product");
    }
  }
}