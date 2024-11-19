using FluentValidation;

namespace Application.Users.Commands.ConfirmRegister;

public class ConfirmRegisterCommandValidator : AbstractValidator<ConfirmRegisterCommand>
{
    public ConfirmRegisterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email must not be empty")
            .EmailAddress().WithMessage("Email format is invalid.");
        RuleFor(x => x.Token)
            .NotEmpty()
            .WithMessage("Token must not be empty");
    }
}