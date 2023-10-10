using Application.Questionnaires.Commands.UpdateQuestionnaire;
using Application.Questionnaires.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    public class QuestionnarieController : ApiControllerBase
    {
        [Authorize(Policy = "UserIdPolicy")]
        [HttpPut("Edit/{id}")]
        public async Task<IActionResult> Edit(string id)
        {
            await Mediator.Send(new UpdateQuestionnaireCommand());
            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("Get/{id}")]
        public async Task<IActionResult> Get(string id)
        {
            return Ok(await Mediator.Send(new GetQuestionnaireQuery()));
        }
    }
}