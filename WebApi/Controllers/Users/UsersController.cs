using System.Security.Claims;
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
        // Запускаем процесс аутентификации
        return Challenge(new AuthenticationProperties
        {
            RedirectUri = "https://petprotector.ru/profile",
            AllowRefresh = true// URL для обработки после авторизации
        }, "Yandex");
    }
    
    [HttpGet("yandex-callback")]
    public async Task<IActionResult> YandexCallback(string state, string code)
    {
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

}