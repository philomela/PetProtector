namespace Application.Common.Interfaces;

public interface IExecutionContextAccessor
{
    Guid UserId { get; }

    //Guid CorrelationId { get; }
}