using Application.Common.Dtos.EmailSender;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.ConfirmRegister;

public record ConfirmRegisterCommand : IRequest<Unit>
{
    public string Email { get; set; }
    
    public string Token { get; set; }
}

internal record ConfirmRegisterCommandHandler : IRequestHandler<ConfirmRegisterCommand, Unit>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IEmailSender _emailSender;

    public ConfirmRegisterCommandHandler(UserManager<AppUser> userManager, IEmailSender emailSender)
        => (_userManager, _emailSender) = (userManager, emailSender);

    public async Task<Unit> Handle(ConfirmRegisterCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email) ?? throw new NotFoundException("User was not found");;

        if (user.EmailConfirmed) throw new BadRequestException("Request invalid");
        
        var result = await _userManager.ConfirmEmailAsync(user, request.Token);
        if (!result.Succeeded && result.Errors.Any())
            throw new BadRequestException("Request invalid");

        await _emailSender.SendAsync(
            new EmailMessage("noreply@petprotector.ru", user?.Email, $"Благодарим за регистрацию, ознакомьтесь с инструкцией как привязать браслет", "Инструкция"), cancellationToken);

        return Unit.Value;
    }
}