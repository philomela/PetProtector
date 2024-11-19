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
    }
}