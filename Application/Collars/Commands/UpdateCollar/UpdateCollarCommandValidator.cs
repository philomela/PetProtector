using FluentValidation;

namespace Application.Collars.Commands.UpdateCollar;

public class UpdateCollarCommandValidator : AbstractValidator<UpdateCollarCommand>
{
    public UpdateCollarCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Id was not empty");
    }
}