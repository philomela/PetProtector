using System.Text.Json;
using Application.Users.Commands.ConfirmRegister;
using Application.Users.Commands.CreateUser;
using Application.Users.Commands.CreateUserYandex;
using Application.Users.Commands.ForgotPassword;
using Application.Users.Commands.Restore;
using Application.Users.Queries;
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
    
    [AllowAnonymous]
    [HttpPost("LoginVk")]
    public async Task<IActionResult> CreateUserVk([FromBody] VkTokenRequest request)
    {
        Console.WriteLine("start method LoginVk");
        if (string.IsNullOrEmpty(request.AccessToken) || string.IsNullOrEmpty(request.Email))
        {
            return BadRequest(new { error = "Token is missing." });
        }

        await Mediator.Send(new SignInVkCommand()
        {
            AccessToken = request.AccessToken,
            Email = request.Email
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
    
    
    [AllowAnonymous]
    [HttpGet("CallbackVk")]
    public async Task<IActionResult> CallbackVk(string state, string code, string device_id)
    {
        Console.WriteLine("start method LoginVk" + " " + state + " " + code + " " + device_id);
        if (string.IsNullOrEmpty(state) || string.IsNullOrEmpty(code))
        {
            return BadRequest(new { error = "Token is missing." });
        }

        await Mediator.Send(new SignInVkCommand()
        {
            AccessToken = code,
            Email = state
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
    
    // Модель для запроса
    public class VkTokenRequest
    {
        public string AccessToken { get; set; }
        public string Email { get; set; }
    }
}