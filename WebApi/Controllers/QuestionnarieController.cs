using Application.Questionnaires.Commands.UpdateQuestionnaire;
using Application.Questionnaires.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    public class QuestionnariesController : ApiControllerBase
    {
        [Authorize(Policy = "UserIdPolicy")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(string id)
        {
            await Mediator.Send(new UpdateQuestionnaireCommand());
            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            return Ok(await Mediator.Send(new GetQuestionnaireQuery() { Id = id }));
        }

        //[Authorize(Policy = "UserIdPolicy")]
        //[HttpGet("/{id}")]
        //public async Task<IActionResult> (string id)
        //{
        //    var userId = _http
        //    await Mediator.Send(new UpdateQuestionnaireCommand());
        //    return NoContent();
        //}
    }
}