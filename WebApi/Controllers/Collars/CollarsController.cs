using Application.Collars.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Collars;

public class CollarsController : ApiControllerBase
{
    [Authorize(Policy = "UserIdPolicy")]
    [HttpGet]
    public async Task<IActionResult> GetCollars()
    {
        return Ok(await Mediator.Send(new GetCollarsQuery()));
    }
}