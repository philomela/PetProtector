using MediatR;

namespace Application.Questionnaires.Queries;

public record GetQuestionnaireQuery : IRequest<QuestionnaireVm>
{
    public Guid Id { get; set; }
}

public record GetQuestionnaireQueryHandler : IRequestHandler<GetQuestionnaireQuery, QuestionnaireVm>
{
    public async Task<QuestionnaireVm> Handle(GetQuestionnaireQuery request, CancellationToken cancellationToken)
    {
        return new QuestionnaireVm()
        {
            Id = Guid.NewGuid(),
            OwnersName = "Roman",
            PetsName = "Marf",
            PhoneNumber = "89998458109"
        };
    }
}
