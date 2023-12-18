using Application.Common.Interfaces;
using Domain.Core.Entities;
using Domain.Core.Events;
using MediatR;

namespace Application.Collars.EventHandlers;

public class CollarCreatedEventHandler : INotificationHandler<CollarCreatedEvent>
{
    private readonly IAppDbContext _appDbContext;

    public CollarCreatedEventHandler(IAppDbContext appDbContext)
        => _appDbContext = appDbContext; 
    
    public async Task Handle(CollarCreatedEvent notification, CancellationToken cancellationToken)
    {
        // await _appDbContext.Questionnaires.AddAsync(new Questionnaire()
        // {
        //     Id = new Random().Next(),
        //     OwnersName = "Roman",
        //     State = "Created",
        //     PetsName = "Jessy",
        //     PhoneNumber = "79998458109",
        //     CollarId = notification.CollarId
        // });

        //await _appDbContext.SaveChangesAsync(cancellationToken);
    }
}