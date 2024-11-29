using Application.Authentication.Commands.Authenticate;
using Application.Authentication.Commands.Logout;
using Application.Authentication.Commands.RefreshToken;
using Application.OAuth.GetPKCE;
using Application.Users.Commands.CreateUserYandex;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace WebApi.Controllers;

public class AccountsController : ApiControllerBase
{
    [AllowAnonymous]
    [EnableRateLimiting("RequestLimiterThreeHours")]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(AuthenticateCommand authData)
    {
        var token = await Mediator.Send(authData);

        return Ok(new { token });
    }
    
    [Authorize(Policy = "UserIdPolicy")]
    [EnableRateLimiting("RequestLimiterThreeHours")]
    [HttpPost("Logout")]
    public async Task<IActionResult> Logout(LogoutCommand logoutData)
    {
        return Ok(await Mediator.Send(logoutData));
    }

    [AllowAnonymous]
    [HttpPost("RefreshToken")]
    public async Task<IActionResult> RefreashToken(RefreshTokenCommand refreshTokenData)
    {
        var token = await Mediator.Send(refreshTokenData);

        return Ok(new { token });
    }
    
    [AllowAnonymous]
    [HttpGet("GetPKCE")]
    public async Task<IActionResult> GenerateStateAndChallenge()
    {
        return Ok(await Mediator.Send(new GetPkceQuery() {}));
    }

    [AllowAnonymous]
    [HttpGet("CallbackVk")]
    public async Task<IActionResult> CallbackVk(string state, string code, string device_id)
    {
        if (string.IsNullOrEmpty(state) || string.IsNullOrEmpty(code) || string.IsNullOrEmpty(device_id))
        {
            return BadRequest(new { error = "Parameters is missing" });
        }

        // Разделяем state на оригинальный state и redirect URL
        var stateParts = state.Split('|');
        var originalState = stateParts[0];
        var redirectUrl = stateParts.Length > 1 ? stateParts[1] : "/";
        
        var result = await Mediator.Send(new SignInVkCommand()
        {
            Code = code,
            DeviceId = device_id,
            State = state
        });
        
        // Возвращаем токен и redirect URL
        return Redirect($"{redirectUrl}?accessToken={result}");
    }
}
