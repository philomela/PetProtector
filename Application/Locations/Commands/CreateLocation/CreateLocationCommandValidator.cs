using FluentValidation;

namespace Application.Locations.Commands.CreateLocation;

public class CreateLocationCommandValidator : AbstractValidator<CreateLocationCommand>
{
    public CreateLocationCommandValidator()
    {
        RuleFor(x => x.Latitude).NotEmpty().WithMessage("Latitude was not empty");
        RuleFor(x => x.Longitude).NotEmpty().WithMessage("Longitude was not empty");
        RuleFor(x => x.LinkQuestionnaire).NotEmpty().WithMessage("QuestionnaireId was not empty");
    }
}