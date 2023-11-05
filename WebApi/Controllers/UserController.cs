using Application.Users.Commands.CreateUser;
using Application.Users.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public class UserController : ApiControllerBase
{
    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<IActionResult> Register(CreateUserCommand command)
    {
        await Mediator.Send(command);
        return Ok();
    }

    [Authorize(Policy = "UserIdPolicy")] // Добавить для адимина.
    [HttpPost("GetUserInfo")]
    public async Task<IActionResult> GetUserInfo(GetUserQuery query)
    {
        return Ok(await Mediator.Send(query));
    }
}