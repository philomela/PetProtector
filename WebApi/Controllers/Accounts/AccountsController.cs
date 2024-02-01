using Application.Authentication.Commands.Authenticate;
using Application.Authentication.Commands.Logout;
using Application.Authentication.Commands.RefreshToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public class AccountsController : ApiControllerBase
{
    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(AuthenticateCommand authData)
    {
        var token = await Mediator.Send(authData);

        return Ok(new { token });
    }
    
    [Authorize(Policy = "UserIdPolicy")]
    [HttpPost("Logout")]
    public async Task<IActionResult> Logout(LogoutCommand logoutData)
    {
        //Иногда прилетает на logout запрос, разобраться откуда и когда.
        return Ok(await Mediator.Send(logoutData));
    }

    [AllowAnonymous]
    [HttpPost("RefreshToken")]
    public async Task<IActionResult> RefreashToken(RefreshTokenCommand refreshTokenData)
    {
        var token = await Mediator.Send(refreshTokenData);

        return Ok(new { token });
    }
}
