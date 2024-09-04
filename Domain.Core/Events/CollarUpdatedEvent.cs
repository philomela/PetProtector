using Domain.Core.Common;

namespace Domain.Core.Events;

public class CollarUpdatedEvent : BaseEvent
{
    public CollarUpdatedEvent(Guid collarId) 
        => CollarId = collarId;
    
    public Guid CollarId { get; }
}