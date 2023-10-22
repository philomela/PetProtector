using Domain.Core;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.Commands.CreateUser;

public record CreateUserCommand : IRequest<Unit>
{
    public string FullName { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }
}

public record CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Unit>
{
    private readonly UserManager<AppUser> _userManager;

    public CreateUserCommandHandler(UserManager<AppUser> userManager) 
        => (_userManager) = (userManager);

    public async Task<Unit> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new AppUser()
        {
            Email = request.Email,
            UserName = request.Email,
            FullName = request.FullName
        };

        user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, request.Password);

        var result = await _userManager.CreateAsync(user);

        if (!result.Succeeded && result.Errors.Any())
            throw new Exception("User was not created");

        return Unit.Value;

    }
}
