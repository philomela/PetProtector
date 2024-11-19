using FluentValidation;

namespace Application.Authentication.Commands.RefreshToken;

public class RefreshTokenValidator : AbstractValidator<RefreshTokenCommand> 
{
    public RefreshTokenValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token is required");
    }
}
