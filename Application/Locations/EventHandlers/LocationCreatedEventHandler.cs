using Application.Common.Dtos.EmailSender;
using Application.Common.Interfaces;
using Domain.Core.Events;
using MediatR;

namespace Application.Locations.EventHandlers;

public class LocationCreatedEventHandler : INotificationHandler<LocationCreatedEvent>
{
    private readonly IAppDbContext _appDbContext;
    private readonly IEmailSender _emailSender;

    public LocationCreatedEventHandler(IAppDbContext appDbContext, IEmailSender emailSender) 
        => (_appDbContext, _emailSender) = (appDbContext, emailSender);
    
    public async Task Handle(LocationCreatedEvent notification, CancellationToken cancellationToken)
    {
        //todo: Необходимо брать нужный email для отправки пользователю.
        await _emailSender.SendAsync( new EmailMessage("romaphilomela@yandex.ru", "romaphilomela@yandex.ru", $"Ваш питомец найден, его геопозиция доступна в вашем ЛК",
            "Ваш питомец найден!"), cancellationToken);
    }
}