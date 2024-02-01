using Application.Common.Interfaces;

namespace Infrastructure.EmailSender;

public class EmailSender : IEmailSender<string, string>
{
    public async Task<string> SendAsync(string request)
    {
        throw new NotImplementedException(); //Реализация отправки сообщения на почту
    }
}