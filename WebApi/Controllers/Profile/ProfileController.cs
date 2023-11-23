//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace WebApi.Controllers.Profile;

//public class ProfileController : ApiControllerBase
//{
//    [Authorize(Policy = "UserIdPolicy")]
//    [HttpGet]
//    public async Task<IActionResult> Get()
//    {
//        var result = await Mediator.Send();
//        var token = await Mediator.Send(authData);

//        return Ok(new { token });
//    }
//}
//Сделать получение пользовательских данных расширенные, типо GetUserDetails,
//и получить список браслетов которые уже привязаны к текущему авторизованному пользователю.