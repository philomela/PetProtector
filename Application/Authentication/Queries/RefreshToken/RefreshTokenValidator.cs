using FluentValidation;

namespace Application.Authentication.Queries.RefreshToken;

public class RefreshTokenValidator : AbstractValidator<RefreshTokenCommand> 
{
    public RefreshTokenValidator()
    {
        RuleFor(x => x.Token).NotEmpty().WithMessage("Token was not empty");
    }
}
