using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.Commands.Restore;

public record RestoreUserCommand : IRequest<Unit>
{
    public string Email { get; set; }
    
    public string Token { get; set; }
    
    public string NewPassword { get; set; }
}

public record RestoreUserCommandHandler : IRequestHandler<RestoreUserCommand, Unit>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IEmailSender _emailSender;

    public RestoreUserCommandHandler(UserManager<AppUser> userManager, IEmailSender emailSender) 
        => (_userManager, _emailSender) = (userManager, emailSender);
    
    public async Task<Unit> Handle(RestoreUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email) ??
                   throw new BadRequestException("Invalid reauest");

        var token = Uri.UnescapeDataString(request.Token);
        var resetPassResult = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);
        if (!resetPassResult.Succeeded)
        {
            throw new BadRequestException("Invalid request");
        }
        
        return Unit.Value;
    }
}