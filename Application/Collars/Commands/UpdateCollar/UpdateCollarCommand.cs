using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Enums;
using Domain.Core.Events;
using MediatR;

namespace Application.Collars.Commands.UpdateCollar;

public record UpdateCollarCommand : IRequest<Guid>
{
    public Guid Id { get; set; }
}

internal record UpdateCollarCommandHandler : IRequestHandler<UpdateCollarCommand, Guid>
{
    private readonly IAppDbContext _appDbContext;
    private readonly IExecutionContextAccessor _executionContextAccessor;

    public UpdateCollarCommandHandler(IAppDbContext appDbContext, IExecutionContextAccessor executionContextAccessor)
        => (_appDbContext, _executionContextAccessor) = (appDbContext, executionContextAccessor);
    
    public async Task<Guid> Handle(UpdateCollarCommand request, CancellationToken cancellationToken)
    {
        var userId = _executionContextAccessor.UserId;

        var entity = await _appDbContext.Collars.FindAsync(request.Id, cancellationToken) 
                     ?? throw new NotFoundException("Entity not found");
        
        if (entity.UserId == userId)
        {
            throw new NotFoundException("Entity not found");
        }

        entity.UserId = userId;
        entity.State = CollarStates.Linked;
        
        entity.AddDomainEvent(new CollarUpdatedEvent(request.Id));
        
        await _appDbContext.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}