using FluentValidation;

namespace Application.Questionnaires.Commands.CreateQuestionnaire;

public class CreateQuestionnaireCommandValidator : AbstractValidator<CreateQuestionnaireCommand>
{
    public CreateQuestionnaireCommandValidator()
    {
        RuleFor(cq => cq.Id).NotNull().WithMessage("Id является обязательным")
            .NotEmpty().WithMessage("Id не может быть пустым");
        RuleFor(cq => cq.OwnersName).NotNull().NotEmpty();
        RuleFor(cq => cq.PetsName).NotNull().NotEmpty();
        RuleFor(cq => cq.PhoneNumber).NotNull().NotEmpty();       
    }
}
