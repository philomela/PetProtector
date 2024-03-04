namespace Infrastructure.EmailSender.Configurations;

public record EmailSenderConfiguration(string Server, int Port, string Login, string Password);