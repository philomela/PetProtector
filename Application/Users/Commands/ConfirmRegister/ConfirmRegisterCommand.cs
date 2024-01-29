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

    public ConfirmRegisterCommandHandler(UserManager<AppUser> userManager) 
        => _userManager = userManager;
    
    public async Task<Unit> Handle(ConfirmRegisterCommand request, CancellationToken cancellationToken)
    {
        var user = _userManager
              .Users.Where(u => u.Id == request.UserId.ToString()).ToListAsync();
        throw new NotImplementedException();
    }
}