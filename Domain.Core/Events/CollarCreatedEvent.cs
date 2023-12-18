using Domain.Core.Common;

namespace Domain.Core.Events;

public class CollarCreatedEvent : BaseEvent
{
    public CollarCreatedEvent(Guid collarId) 
        => CollarId = collarId;
    
    public Guid CollarId { get; }
}