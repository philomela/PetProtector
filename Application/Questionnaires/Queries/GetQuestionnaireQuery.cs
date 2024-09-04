using Application.Common.Interfaces;
using AutoMapper;
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

    public GetQuestionnaireQueryHandler(IAppDbContext appDbContext, IMapper mapper)
        => (_appDbContext, _mapper) = (appDbContext, mapper);

    public async Task<QuestionnaireVm> Handle(GetQuestionnaireQuery request, CancellationToken cancellationToken)
    {
        return _mapper.Map<QuestionnaireVm>(await _appDbContext.Questionnaires
            .Where( q => q.LinkQuestionnaire == request.LinkQuestionnaire)
            .FirstOrDefaultAsync(cancellationToken));
    }
}
