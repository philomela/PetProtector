using FluentValidation;

namespace Application.Users.Commands.Restore;

public class RestoreUserCommandValidator : AbstractValidator<RestoreUserCommand>
{
    public RestoreUserCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email invalid");
    }
}