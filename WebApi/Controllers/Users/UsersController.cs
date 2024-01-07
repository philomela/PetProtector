using Application.Users.Commands.CreateUser;
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

    [Authorize(Policy = "UserIdPolicy")] //Добавить для админа.
    [HttpGet("UserInfo")]
    public async Task<IActionResult> UserInfo()
    {
        await Task.Delay(10000);
        return Ok(await Mediator.Send(new GetUserQuery()));
    }
}