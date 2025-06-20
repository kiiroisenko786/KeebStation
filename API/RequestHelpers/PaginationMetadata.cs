using System;

namespace API.RequestHelpers;

public class PaginationMetadata
{
  // How many products match the query before pagination
  public int TotalCount { get; set; }
  public int PageSize { get; set; }
  public int CurrentPage { get; set; }
  public int TotalPages { get; set; }
}
