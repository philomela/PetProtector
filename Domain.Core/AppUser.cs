using Microsoft.AspNetCore.Identity;

namespace Domain.Core;

public class AppUser : IdentityUser
{
    public string FullName { get; set; }
}
