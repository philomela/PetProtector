using FluentValidation;

namespace Application.Collars.Queries.GetCollar;

public class GetCollarQueryValidator : AbstractValidator<GetCollarQuery>
{
    public GetCollarQueryValidator()
    {
        RuleFor(x => x.SecretKey).NotEmpty().WithMessage("Code was not empty");
    }
}