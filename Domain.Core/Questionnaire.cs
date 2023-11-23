namespace Domain.Core;

public record Questionnaire
{
    public long Id { get; set; }

    public string OwnersName { get; set; }

    public string PetsName { get; set; }

    public string PhoneNumber { get; set; }

    public string State { get; set; }

    public string SecretKey { get; set; }
}