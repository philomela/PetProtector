using System.Security.Claims;
using System.Text.Json;
using Application.Users.Commands.ConfirmRegister;
using Application.Users.Commands.CreateUser;
using Application.Users.Commands.CreateUserYandex;
using Application.Users.Commands.ForgotPassword;
using Application.Users.Commands.Restore;
using Application.Users.Queries;
using Domain.Core.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public class UsersController : ApiControllerBase
{
    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<IActionResult> Register(CreateUserCommand command)
    {
        await Mediator.Send(command);
        return Ok();
    }

    [Authorize(Policy = "UserIdPolicy")]
    [HttpGet("UserInfo")]
    public async Task<IActionResult> UserInfo()
    {
        return Ok(await Mediator.Send(new GetUserQuery()));
    }
    
    [AllowAnonymous]
    [HttpPut("ConfirmRegister")]
    public async Task<IActionResult> ConfirmRegister(ConfirmRegisterCommand command)
    {
        return Ok(await Mediator.Send(command));
    }
    
    [AllowAnonymous]
    [HttpPost("ForgotPassword")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordCommand command)
    {
        return Ok(await Mediator.Send(command));
    }
    
    [AllowAnonymous]
    [HttpPost("Restore")]
    public async Task<IActionResult> Restore(RestoreUserCommand command)
    {
        return Ok(await Mediator.Send(command));
    }
    
    
    [HttpGet("sign-in-yandex")]
    public IActionResult SignInWithYandex()
    {
        var redirectUri = "https://petprotector.ru/api/users/yandex-callback";
        var clientId = "e98eb93b84224ac4ac06e2e2ceecf803";
        var state = Guid.NewGuid().ToString();

        var authUrl = $"https://oauth.yandex.ru/authorize?response_type=code&client_id={clientId}&redirect_uri={redirectUri}&state={state}";

        return Redirect(authUrl);
    }
    
    [HttpGet("yandex-callback")]
    public async Task<IActionResult> YandexCallback(string state, string code, string cid)
    {
        Console.WriteLine("ya-callback started");
        var result = await HttpContext.AuthenticateAsync("Yandex");

        if (result.Succeeded)
        {
            var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
            var name = result.Principal.FindFirst(ClaimTypes.Name)?.Value;

            return Ok(await Mediator.Send(new CreateUserYandexCommand
            {
                Email = email,
                Name = name
            }));
        }

        return Unauthorized();
    }
    
    
    [HttpGet("vk-callback")]
public async Task<IActionResult> VkCallback([FromQuery] string code, [FromQuery] string state)
{
    Console.WriteLine("This is " + code);
    if (string.IsNullOrEmpty(code))
    {
        return BadRequest(new { error = "Authorization code is missing." });
    }

    try
    {
        var clientId = "52743816";  // Укажите ваш Client ID
        var clientSecret = "your_vk_client_secret"; // Укажите ваш Client Secret
        var redirectUri = "https://petprotector.ru/profile";

        // Обмен кода на токен
        using var httpClient = new HttpClient();
        var tokenResponse = await httpClient.GetAsync(
            $"https://oauth.vk.com/access_token?" +
            $"client_id={clientId}&client_secret={clientSecret}&redirect_uri={redirectUri}&code={code}");

        if (!tokenResponse.IsSuccessStatusCode)
        {
            return BadRequest(new { error = "Failed to exchange code for access token." });
        }

        var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
        var tokenData = JsonSerializer.Deserialize<TokenResponse>(tokenContent);

        // Получение информации о пользователе
        var userResponse = await httpClient.GetAsync(
            $"https://api.vk.com/method/users.get?" +
            $"user_ids={tokenData.UserId}&fields=email&access_token={tokenData.AccessToken}&v=5.131");

        if (!userResponse.IsSuccessStatusCode)
        {
            return BadRequest(new { error = "Failed to retrieve user information." });
        }

        var userContent = await userResponse.Content.ReadAsStringAsync();
        var userData = JsonSerializer.Deserialize<VKUserResponse>(userContent);

        // Сохранение пользователя через Mediator
        var user = userData.Response.FirstOrDefault();
        Console.WriteLine(user.Id + " " + user.LastName + " " + user.FirstName);
        return Ok(user
        //     await Mediatoddr.Send(new CreateUserVkCommand
        // {
        //     Email = tokenData.Email, // Email приходит из токен-ответа
        //     Name = $"{user.FirstName} {user.LastName}"
        // })d
            );
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.Message });
    }
}


private class TokenResponse
{
    public string AccessToken { get; set; }
    public string Email { get; set; } // VK возвращает email в токене
    public string UserId { get; set; }
}

private class VKUserResponse
{
    public List<VKUser> Response { get; set; }

    public class VKUser
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}

}

