namespace Domain.Core;

public record Collar
{
    public Guid Id { get; set; }

    public string SecretKey { get; set; }

    public Questionnaire Questionnaire { get; set; }
    
    public long QuestionnaireId { get; set; }
    
    public Guid UserId { get; set; }
}