using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Enums;
using Domain.Core.Events;
using MediatR;

namespace Application.Collars.EventHandlers;

public class CollarUpdatedEventHandler : INotificationHandler<CollarUpdatedEvent>
{
    private readonly IAppDbContext _appDbContext;

    public CollarUpdatedEventHandler(IAppDbContext appDbContext)
        => _appDbContext = appDbContext; 
    
    public async Task Handle(CollarUpdatedEvent notification, CancellationToken cancellationToken)
    {
        var questionnaire = await _appDbContext
            .Questionnaires
            .FindAsync(notification.CollarId, cancellationToken) 
                            ?? throw new NotFoundException("Entity was not found");
        
        //todo: стейт машину попробовать прикрутить
        if (questionnaire.State == QuestionnaireStates.WaitingFilling)
        {
            questionnaire.State = QuestionnaireStates.Filling;
        }
        else
        {
            throw new NotFoundException("Entity was not found"); //todo: тут новое исключение
        }
        
        await _appDbContext.SaveChangesAsync(cancellationToken);
    }
}