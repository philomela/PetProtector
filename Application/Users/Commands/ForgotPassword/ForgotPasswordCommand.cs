using Application.Common.Dtos.EmailSender;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;

namespace Application.Users.Commands.ForgotPassword;

public record ForgotPasswordCommand : IRequest<Unit>
{
    public string Email { get; set; }
}

public record ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, Unit>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IEmailSender _emailSender;
    private readonly IExecutionContextAccessor _executionContextAccessor;

    public ForgotPasswordCommandHandler(
        UserManager<AppUser> userManager, 
        IEmailSender emailSender, 
        IExecutionContextAccessor executionContextAccessor) 
        => (_userManager, _emailSender, _executionContextAccessor) = (userManager, emailSender, executionContextAccessor);
    
    public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email)
                   ?? throw new BadRequestException("Request invalid");

        if (!user.EmailConfirmed) throw new BadRequestException("Request invalid"); 
        
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        
        var queryParams = new Dictionary<string, string>()
        {
            { "token", token },
            { "email", request.Email }
        };

        var callback = QueryHelpers.AddQueryString($"{_executionContextAccessor.BaseUrl}/restore", queryParams!);

        Console.WriteLine(callback);
        
        await _emailSender.SendAsync(new EmailMessage("noreply@petprotector.ru", user.Email,  $"Пожалуйста, сбросьте пароль, перейдя по ссылке: <a href='{callback}'>ссылка</a>", "Сброс пароля"), cancellationToken);

        return Unit.Value;
    }
}