using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
  [HttpGet("not-found")]
  // If we're not returning a specific type, we can use IActionResult
  // We use it when we want to return for e.g a http response and don't want to supply a type
  public IActionResult GetNotFound()
  {
    return NotFound();
  }

  [HttpGet("bad-request")]
  public IActionResult GetBadRequest()
  {
    return BadRequest("This is a bad request!");
  }

  [HttpGet("unauthorized")]
  public IActionResult GetUnauthorized()
  {
    return Unauthorized();
  }

  [HttpGet("validation-error")]
  public IActionResult GetValidationError()
  {
    ModelState.AddModelError("Problem1", "This is the first error");
    ModelState.AddModelError("Problem2", "This is the second error");
    return ValidationProblem();
  }

  // internal server error
  [HttpGet("server-error")]
  public IActionResult GetServerError()
  {
    throw new Exception("This is a server error");
  }
  
}
