using MediatR;

namespace Application.Questionnaires.Commands.UpdateQuestionnaire;

public record UpdateQuestionnaireCommand : IRequest<Guid>
{
    public Guid Id { get; set; }

    public string OwnersName { get; set; }

    public string PetsName { get; set; }

    public string PhoneNumber { get; set; }
}
internal record UpdateQuestionnaireCommandHandler : IRequestHandler<UpdateQuestionnaireCommand, Guid>
{
    public async Task<Guid> Handle(UpdateQuestionnaireCommand request, CancellationToken cancellationToken)
    {
        //Проставлять state = completed
        return Guid.NewGuid();
    }
}
