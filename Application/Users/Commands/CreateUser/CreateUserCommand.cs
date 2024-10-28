using Application.Common.Dtos.EmailSender;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;

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
    private readonly IExecutionContextAccessor _executionContextAccessor;

    public CreateUserCommandHandler(UserManager<AppUser> userManager, IEmailSender emailSender, IExecutionContextAccessor executionContextAccessor) 
        => (_userManager, _emailSender, _executionContextAccessor) = (userManager, emailSender, executionContextAccessor);

    public async Task<Unit> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new AppUser()
        {
            Email = request.Email,
            UserName = request.Email,
            FullName = request.FullName,
            CreatedAt = DateTime.UtcNow.Date
        };

        user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, request.Password);

        var result = await _userManager.CreateAsync(user);

        if (!result.Succeeded && result.Errors.Any())
            throw new Exception("User was not created");

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        
        var queryParams = new Dictionary<string, string>()
        {
            { "token", token },
            { "email", request.Email }
        };
       
        var callback = QueryHelpers.AddQueryString($"{_executionContextAccessor.BaseUrl}/confirmRegister", queryParams!);
        
        await _emailSender.SendAsync(
            new EmailMessage("noreply@petprotector.ru", user.Email, $"Спасибо за регистрацию! Подтвердите регистрацию по ссылке: {callback}",
                "Подтверждение регистрации"), cancellationToken); //todo: брать базовый url приложения

        return Unit.Value;

    }
}
