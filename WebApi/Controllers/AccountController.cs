using Application.Authentication.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public class AccountController : ApiControllerBase
{
    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(AuthenticateQuery authData)
    {
        var token = await Mediator.Send(authData);

        return Ok(new { token });
    }
}
