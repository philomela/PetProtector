namespace Application.Common.Dtos.EmailSender;

public record EmailMessage (string From, string To, string Html, string Subject);