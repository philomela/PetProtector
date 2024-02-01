using FluentValidation;

namespace Application.Users.Commands.ConfirmRegister;

public class ConfirmRegisterCommandValidator : AbstractValidator<ConfirmRegisterCommand>
{
    public ConfirmRegisterCommandValidator()
    {
        RuleFor(u => u.UserId)
            .NotEmpty()
            .WithMessage("UserId was empty");
    }
}