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

        await Mediator.Send(new SignInVkCommand()
        {
            Code = code,
            DeviceId = device_id,
            State = state
        });
        // try
        // {
        //     // Запрос информации о пользователе
        //     using var httpClient = new HttpClient();
        //     var response = await httpClient.GetAsync(
        //         $"https://api.vk.com/method/users.get?access_token={request.AccessToken}&v=5.131");
        //
        //     if (!response.IsSuccessStatusCode)
        //     {
        //         return BadRequest(new { error = "Failed to retrieve user information." });
        //     }
        //
        //     var userContent = await response.Content.ReadAsStringAsync();
        //     Console.WriteLine($"{userContent.ToString()}");
        //     var userData = JsonSerializer.Deserialize<VKUserResponse>(userContent);
        //
        //     if (userData?.Response == null || !userData.Response.Any())
        //     {
        //         return BadRequest(new { error = "User information is invalid." });
        //     }
        //     
        //     Console.WriteLine($"{userData}");
        //
        //     var user = userData.Response.First();
        //     Console.WriteLine(user.Email + user.FirstName);
        //     //var userExists = await _userRepository.ExistsAsync(user.Id);
        //
        //     // if (!userExists)
        //     // {
        //     //     // Создание нового пользователя
        //     //     await _userRepository.AddAsync(new User
        //     //     {
        //     //         VkId = user.Id,
        //     //         Name = $"{user.FirstName} {user.LastName}",
        //     //         Email = user.Email
        //     //     });
        //     // }
        //
        //     return Ok(new { success = true, user = user });
        // }
        // catch (Exception ex)
        // {
        //     return StatusCode(500, new { error = ex.Message });
        // }
        return Ok();
    }
}
