using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Core.Entities;
using Domain.Core.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Questionnaires.Queries;

public record GetQuestionnaireQuery : IRequest<QuestionnaireVm>
{
    public Guid LinkQuestionnaire { get; set; }
}

internal record GetQuestionnaireQueryHandler : IRequestHandler<GetQuestionnaireQuery, QuestionnaireVm>
{
    private readonly IAppDbContext _appDbContext;
    private readonly IMapper _mapper;
    private readonly IRedisCache _cache;

    public GetQuestionnaireQueryHandler(IAppDbContext appDbContext, IMapper mapper, IRedisCache cache)
        => (_appDbContext, _mapper, _cache) = (appDbContext, mapper, cache);

    public async Task<QuestionnaireVm> Handle(GetQuestionnaireQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"questionnaire-{nameof(GetQuestionnaireQueryHandler)}-{request.LinkQuestionnaire}";
        
        var questionnaire = await _cache.GetAsync<Questionnaire>(cacheKey, cancellationToken);

        if (questionnaire is not null)
        {
            return _mapper.Map<QuestionnaireVm>(questionnaire);
        }

        questionnaire = await _appDbContext.Questionnaires
            .Where(q => q.LinkQuestionnaire == request.LinkQuestionnaire && q.State == QuestionnaireStates.Filled)
            .FirstOrDefaultAsync(cancellationToken) ?? throw new NotFoundException("Questionnaire not found");
        
        await _cache.SetAsync(cacheKey, questionnaire, cancellationToken, TimeSpan.FromMinutes(3));
        
        return _mapper.Map<QuestionnaireVm>(questionnaire);
    }
}
