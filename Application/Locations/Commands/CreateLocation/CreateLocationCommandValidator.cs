using FluentValidation;

namespace Application.Locations.Commands.CreateLocation;

public class CreateLocationCommandValidator : AbstractValidator<CreateLocationCommand>
{
    public CreateLocationCommandValidator()
    {
        RuleFor(x => x.Latitude)
            .NotEmpty().WithMessage("Latitude was not empty")
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90");
        
        RuleFor(x => x.Longitude)
            .NotEmpty().WithMessage("Longitude was not empty")
            .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180");
        
        RuleFor(x => x.LinkQuestionnaire)
            .NotNull().WithMessage("LinkQuestionnaire is required")
            .NotEmpty().WithMessage("LinkQuestionnaire was not empty")
            .Must(id => Guid.TryParse(id.ToString(), out _)).WithMessage("LinkQuestionnaire must be a valid");;
    }
}