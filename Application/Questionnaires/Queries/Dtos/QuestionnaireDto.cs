﻿namespace Application.Questionnaires.Queries.Dtos;

public class QuestionnaireDto
{
    public string OwnersName { get; set; }

    public string PetsName { get; set; }

    public string PhoneNumber { get; set; }
    
    public Guid LinkQuestionnaire { get; set; }
    
    public string State { get; set; }
}