using FluentValidation;

namespace Application.Users.Commands.ConfirmRegister;

public class ConfirmRegisterCommandValidator : AbstractValidator<ConfirmRegisterCommand>
{
    public ConfirmRegisterCommandValidator()
    {
        RuleFor(u => u.Email)
            .NotEmpty()
            .WithMessage("Email was empty");
        RuleFor(u => u.Token)
            .NotEmpty()
            .WithMessage("Token was empty");
    }
}