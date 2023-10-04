using Microsoft.AspNetCore.Identity;

namespace Domain.Core;

public class AppUser : IdentityUser
{
    public Guid QuestionnaireId { get; set; }
}
