using Application.Common.Dtos.EmailSender;
using Application.Common.Interfaces;
using Domain.Core.Entities;
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
    private readonly IEmailSender _emailSender;

    public CreateUserCommandHandler(UserManager<AppUser> userManager, IEmailSender emailSender) 
        => (_userManager, _emailSender) = (userManager, emailSender);

    public async Task<Unit> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new AppUser()
        {
            Email = request.Email,
            UserName = request.Email,
            FullName = request.FullName,
            CreatedAt = DateTime.Now.Date
        };

        user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, request.Password);

        var result = await _userManager.CreateAsync(user);

        if (!result.Succeeded && result.Errors.Any())
            throw new Exception("User was not created");
        
        await _emailSender.SendAsync(
            new EmailMessage("romaphilomela@yandex.ru", "romaphilomela@yandex.ru", $"Спасибо за регистрацию! Подтвердите регистрацию по ссылке: https://localhost:5173/confirmRegister/{user.Id}",
                "Подтверждение регистрации"), cancellationToken);

        return Unit.Value;

    }
}
