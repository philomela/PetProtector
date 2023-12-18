using Domain.Core.Common;

namespace Domain.Core.Entities;

public class Collar : BaseEntity
{
    public Guid Id { get; set; }

    public string SecretKey { get; set; }

    public Questionnaire Questionnaire { get; set; }
    
    public Guid UserId { get; set; }
}