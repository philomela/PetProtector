using Application.Locations.Commands.CreateLocation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace WebApi.Controllers.Locations;

public class LocationsController : ApiControllerBase
{
    [HttpPost]
    [EnableRateLimiting("RequestLimiterOneHour")]
    public async Task<IActionResult> Create(CreateLocationCommand locationData)
    {
        return Ok(await Mediator.Send(locationData));
    }
}