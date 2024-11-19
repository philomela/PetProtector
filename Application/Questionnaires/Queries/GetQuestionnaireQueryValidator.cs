using FluentValidation;

namespace Application.Questionnaires.Queries;

public class GetQuestionnaireQueryValidator : AbstractValidator<GetQuestionnaireQuery>
{
    public GetQuestionnaireQueryValidator()
    {
        RuleFor(x => x.LinkQuestionnaire)
            .NotNull().WithMessage("LinkQuestionnaire is required")
            .NotEmpty().WithMessage("LinkQuestionnaire cannot be empty")
            .Must(id => Guid.TryParse(id.ToString(), out _)).WithMessage("LinkQuestionnaire must be a valid");
    }
}
