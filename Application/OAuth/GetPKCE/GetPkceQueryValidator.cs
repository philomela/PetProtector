using FluentValidation;

namespace Application.OAuth.GetPKCE;

public class GetPkceQueryValidator : AbstractValidator<GetPkceQuery>
{
    public GetPkceQueryValidator()
    {
        // RuleFor(x => x.RedirectUri)
        //     .NotNull().WithMessage("RedirectUri is required")
        //     .NotEmpty().WithMessage("RedirectUri cannot be empty");
    }
}