using Domain.Core;
using MediatR;

namespace Application.Questionnaires.Commands.CreateQuestionnaire;

public record CreateQuestionnaireCommand : IRequest<Unit>
{
    public Guid Id { get; set; }

    public string OwnersName { get; set; }

    public string PetsName { get; set; }

    public string PhoneNumber { get; set; }
}

public record CreateQuestionnaireCommandHandler : IRequestHandler<CreateQuestionnaireCommand, Unit>
{
    public async Task<Unit> Handle(CreateQuestionnaireCommand request, CancellationToken cancellationToken)
    {
        var obj = new Questionnaire { };

        return Unit.Value;
    }
}