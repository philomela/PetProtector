using Domain.Core.Common;
using Domain.Core.Enums;

namespace Domain.Core.Entities;

public class Collar : BaseEntity
{
    public Guid Id { get; set; }

    public string SecretKey { get; set; }

    public Questionnaire Questionnaire { get; set; }
    
    public CollarStates State { get; set; }
    
    public Guid UserId { get; set; }
    
    public ICollection<Location> Locations { get; set; }
}