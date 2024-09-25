namespace Application.Common.Interfaces;

public interface IExecutionContextAccessor
{
    Guid UserId { get; }
    
    string BaseUrl { get; }
    
    //Guid CorrelationId { get; }
}