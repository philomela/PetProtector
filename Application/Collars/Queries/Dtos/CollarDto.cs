using Application.Questionnaires.Queries.Dtos;

namespace Application.Collars.Queries.Dtos;

public record CollarDto
{
    public Guid Id { get; set; }

    public QuestionnaireDto Questionnaire { get; set; }
}