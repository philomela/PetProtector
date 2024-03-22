using Application.Common.Interfaces;
using Infrastructure.EmailSender.Configurations;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;
using Application.Common.Dtos.EmailSender;

namespace Infrastructure.EmailSender;

public class EmailSender : IEmailSender
{
    private readonly EmailSenderConfiguration _config;
    public EmailSender(EmailSenderConfiguration config) => _config = config;

    public async Task SendAsync(EmailMessage msg, CancellationToken cancellationToken)
    {
        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(msg.From));
        message.To.Add(MailboxAddress.Parse(msg.To));
        message.Subject = msg.Subject;
        message.Body = new TextPart(TextFormat.Html) { Text = msg.Html };

        using var client = new SmtpClient();
        await client.ConnectAsync(_config.Server,
            int.TryParse(_config.Port, out var otp)
                ? otp
                : throw new Exception("EmailSender smpt port was not initialise"), true, cancellationToken);
        await client.AuthenticateAsync(_config.Login, _config.Password, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}