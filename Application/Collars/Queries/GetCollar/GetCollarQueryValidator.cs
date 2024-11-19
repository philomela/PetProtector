using FluentValidation;

namespace Application.Collars.Queries.GetCollar;

public class GetCollarQueryValidator : AbstractValidator<GetCollarQuery>
{
    public GetCollarQueryValidator()
    {
        RuleFor(x => x.SecretKey)
            .NotEmpty().WithMessage("Secret key cannot be empty")
            .MinimumLength(6).WithMessage("Secret key must be at least 6 characters long")
            .Matches(@"[a-z]+").WithMessage("Secret key must contain at least one lowercase letter")
            .Matches(@"\d+").WithMessage("Secret key must contain at least one digit");
    }
}