using Application.Questionnaires.Commands.UpdateQuestionnaire;
using Application.Questionnaires.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    public class QuestionnariesController : ApiControllerBase
    {
        [Authorize(Policy = "UserIdPolicy")]
        [HttpPut]
        public async Task<IActionResult> Update(UpdateQuestionnaireCommand updateQuestionnaireData)
        {
            await Mediator.Send(updateQuestionnaireData);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            return Ok(await Mediator.Send(new GetQuestionnaireQuery() { LinkQuestionnaire = id }));
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