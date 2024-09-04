using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using Domain.Core.Events;
using MediatR;

namespace Application.Locations.Commands.CreateLocation;

public record CreateLocationCommand : IRequest<Unit>
{
    public decimal Latitude { get; set; }
    
    public decimal Longitude { get; set; }

    public DateTime CreatedAt { get; set; }
    
    public Guid LinkQuestionnaire { get; set; }
}

internal record CreateLocationCommandHandler : IRequestHandler<CreateLocationCommand, Unit>
{
    private readonly IAppDbContext _appDbContext;

    public CreateLocationCommandHandler(IAppDbContext appDbContext) 
        => _appDbContext = appDbContext;
    
    public async Task<Unit> Handle(CreateLocationCommand request, CancellationToken cancellationToken)
    {
        var collarId = _appDbContext.Questionnaires
            .FirstOrDefault(q => q.LinkQuestionnaire == request.LinkQuestionnaire)?.Id 
                       ?? throw new BadRequestException("Invalid LinkQuestionnaire");
        
        var entity = new Location()
        {
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            CreatedAt = DateTime.Now,
            CollarId = collarId
        };
        
        entity.AddDomainEvent(new LocationCreatedEvent(entity.CollarId));
        
        await _appDbContext.Locations.AddAsync(entity, cancellationToken);
        
        await _appDbContext.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}