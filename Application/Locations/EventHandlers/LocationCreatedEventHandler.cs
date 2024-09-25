using Application.Common.Dtos.EmailSender;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using Domain.Core.Events;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.EventHandlers;

public class LocationCreatedEventHandler : INotificationHandler<LocationCreatedEvent>
{
    private readonly IAppDbContext _appDbContext;
    private readonly UserManager<AppUser> _userManager;
    private readonly IEmailSender _emailSender;

    public LocationCreatedEventHandler(
        IAppDbContext appDbContext, 
        UserManager<AppUser> userManager, 
        IEmailSender emailSender) 
        => (_appDbContext, _emailSender, _userManager) = (appDbContext, emailSender, userManager);
    
    public async Task Handle(LocationCreatedEvent notification, CancellationToken cancellationToken)
    {
        var collar = await _appDbContext.Collars.FindAsync(notification.CollarId);

        var user = await _userManager.FindByIdAsync(collar?.UserId.ToString()!);
        
        //todo: Просмотреть проверки, и привязки.
        await _emailSender.SendAsync( new EmailMessage("noreply@petprotector.ru", user?.Email!, $"Ваш питомец найден, его геопозиция доступна в вашем ЛК",
            "Ваш питомец найден!"), cancellationToken);
    }
}