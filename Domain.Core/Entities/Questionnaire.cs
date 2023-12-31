﻿using Domain.Core.Common;
using Domain.Core.Enums;

namespace Domain.Core.Entities;

public class Questionnaire : BaseEntity
{
    public Guid Id { get; set; }
    
    public Guid LinkQuestionnaire { get; set; }

    public string OwnersName { get; set; }

    public string PetsName { get; set; }

    public string PhoneNumber { get; set; }

    public QuestionnaireStates State { get; set; }
    
    public Collar Collar { get; set; }
}