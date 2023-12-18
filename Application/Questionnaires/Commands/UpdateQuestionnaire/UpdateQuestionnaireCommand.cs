using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Events;
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
    private readonly IAppDbContext _appDbContext;

    public UpdateQuestionnaireCommandHandler(IAppDbContext appDbContext) 
        => _appDbContext = appDbContext;
    
    public async Task<Guid> Handle(UpdateQuestionnaireCommand request, CancellationToken cancellationToken)
    {
        var entity = await _appDbContext.Questionnaires
            .FindAsync(request.Id) ?? throw new NotFoundException(); //Посмотреть может быть другое исключение.

        entity.OwnersName = request.OwnersName;
        entity.PetsName = request.PetsName;
        entity.PhoneNumber = request.PhoneNumber;
        entity.State = "Completed"; //Вынести в enum, возможно сстоит прикрутить стейт машину, если потребуется
        
        entity.AddDomainEvent(new QuestionnaireUpdatedEvent());

        await _appDbContext.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
