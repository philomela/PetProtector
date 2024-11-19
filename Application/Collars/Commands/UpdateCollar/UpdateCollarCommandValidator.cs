using FluentValidation;

namespace Application.Collars.Commands.UpdateCollar;

public class UpdateCollarCommandValidator : AbstractValidator<UpdateCollarCommand>
{
    public UpdateCollarCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotNull().WithMessage("Id is required")
            .NotEmpty().WithMessage("Id cannot be empty")
            .Must(id => Guid.TryParse(id.ToString(), out _)).WithMessage("Id must be a valid Id");
    }
}