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
    public Guid UserId { get; set; }
}

internal record ConfirmRegisterCommandHandler : IRequestHandler<ConfirmRegisterCommand, Unit>
{
    private readonly UserManager<AppUser> _userManager;
    //private readonly IEmailSender _emailSender;

    public ConfirmRegisterCommandHandler(UserManager<AppUser> userManager)
        => (_userManager) = (userManager);

    public async Task<Unit> Handle(ConfirmRegisterCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager
            .Users
            .Where(u => u.Id == request.UserId.ToString())
            .FirstOrDefaultAsync() ?? throw new NotFoundException("User was not found");

        user.EmailConfirmed = true;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded && result.Errors.Any())
            throw new Exception("User was not updated");

      
        return Unit.Value;
    }
}