using Domain.Core.Common;

namespace Domain.Core.Events;

public class LocationCreatedEvent : BaseEvent
{
    public LocationCreatedEvent(Guid questionnaireId) 
        => QuestionnaireId = questionnaireId;
    
    public Guid QuestionnaireId { get; }
}