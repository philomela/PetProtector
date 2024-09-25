using Domain.Core.Common;

namespace Domain.Core.Events;

public class LocationCreatedEvent : BaseEvent
{
    public LocationCreatedEvent(Guid questionnaireId) 
        => CollarId = questionnaireId;
    
    public Guid CollarId { get; }
}