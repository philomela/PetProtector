namespace Application.Common.Interfaces;

public interface IEmailSender<TRequest, TResult>
{
    Task<TResult> SendAsync(TRequest request);
}