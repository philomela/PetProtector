using Application.Collars.Commands.CreateCollar;
using Application.Collars.Queries.GetCollar;
using Application.Collars.Queries.GetCollars;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Collars;

public class CollarsController : ApiControllerBase
{
    [Authorize(Policy = "UserIdPolicy")]
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await Mediator.Send(new GetCollarsQuery()));
    }
    
    [Authorize(Policy = "UserIdPolicy")] //Политика админа.
    [HttpPost]
    public async Task<IActionResult> Create(CreateCollarCommand collarData)
    {
        return Ok(await Mediator.Send(collarData)); //Вынести вызов, ничего не нужно возвращать, только статус
    }
    
    [Authorize(Policy = "UserIdPolicy")]
    [HttpGet("{code}")]
    public async Task<IActionResult> Get(string code)
    {
        return Ok(await Mediator.Send(new GetCollarQuery() {SecretKey = code}));
    }
}