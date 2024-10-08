﻿using Application.Questionnaires.Commands.UpdateQuestionnaire;
using Application.Questionnaires.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

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
        [EnableRateLimiting("RequestLimiterTenMinutes")]
        public async Task<IActionResult> Get(Guid id)
        {
            return Ok(await Mediator.Send(new GetQuestionnaireQuery() { LinkQuestionnaire = id }));
        }
    }
}