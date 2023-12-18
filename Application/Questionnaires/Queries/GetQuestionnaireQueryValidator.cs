using FluentValidation;

namespace Application.Questionnaires.Queries;

public class GetQuestionnaireQueryValidator : AbstractValidator<GetQuestionnaireQuery>
{
    public GetQuestionnaireQueryValidator()
    {
        RuleFor(q => q.LinkQuestionnaire).NotNull().NotEmpty();
    }
}
