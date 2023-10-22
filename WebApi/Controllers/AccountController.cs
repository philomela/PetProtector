using Application.Authentication.Queries.Authenticate;
using Application.Authentication.Queries.RefreshToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public class AccountController : ApiControllerBase
{
    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(AuthenticateCommand authData)
    {
        var token = await Mediator.Send(authData);

        return Ok(new { token });
    }

    [AllowAnonymous]
    [HttpPost("RefreshToken")]
    public async Task<IActionResult> RefreashToken(RefreshTokenCommand refreshTokenData)
    {
        var token = await Mediator.Send(refreshTokenData);

        return Ok(new { token });
    }
}
