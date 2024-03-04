using Application.Common.Dtos.EmailSender;

namespace Application.Common.Interfaces;

public interface IEmailSender
{
    Task SendAsync(EmailMessage message, CancellationToken cancellationToken);
}