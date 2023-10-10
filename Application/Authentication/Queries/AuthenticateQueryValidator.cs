using FluentValidation;

namespace Application.Authentication.Queries;

public class AuthenticateQueryValidator : AbstractValidator<AuthenticateQuery>
{
    public AuthenticateQueryValidator() {
        RuleFor(a => a.Email).EmailAddress().NotEmpty();
        RuleFor(a => a.Password).NotEmpty();
    }
}
