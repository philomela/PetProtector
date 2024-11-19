using FluentValidation;

namespace Application.Questionnaires.Commands.UpdateQuestionnaire;

public class UpdateQuestionnaireCommandValidator : AbstractValidator<UpdateQuestionnaireCommand>
{
    public UpdateQuestionnaireCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotNull().WithMessage("Id is required")
            .NotEmpty().WithMessage("Id cannot be empty")
            .Must(id => Guid.TryParse(id.ToString(), out _)).WithMessage("Id must be a valid Id");

        RuleFor(x => x.OwnersName)
            .NotNull().WithMessage("Owner's name is required")
            .NotEmpty().WithMessage("Owner's name cannot be empty");

        RuleFor(x => x.PetsName)
            .NotNull().WithMessage("Pet's name is required")
            .NotEmpty().WithMessage("Pet's name cannot be empty");

        RuleFor(x => x.PhoneNumber)
            .NotNull().WithMessage("Phone number is required")
            .NotEmpty().WithMessage("Phone number cannot be empty")
            .Matches(@"^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$")
            .WithMessage("Phone number must be in the format +7 (XXX) XXX-XX-XX");  
    }
}
