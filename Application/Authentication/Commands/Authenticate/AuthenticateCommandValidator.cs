using FluentValidation;

namespace Application.Authentication.Commands.Authenticate;

public class AuthenticateCommandValidator : AbstractValidator<AuthenticateCommand>
{
    public AuthenticateCommandValidator()
    {
        RuleFor(a => a.Email).EmailAddress().NotEmpty();
        RuleFor(a => a.Password).NotEmpty();
    }
}
