using Application.Common.Mappings;
using AutoMapper;
using Domain.Core.Entities;

namespace Application.Questionnaires.Queries;

public record QuestionnaireVm : IMapWith<Questionnaire>
{
    public string OwnersName { get; set; }

    public string PetsName { get; set; }

    public string PhoneNumber { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<Questionnaire, QuestionnaireVm>()
             .ForMember(questionnaireVm => questionnaireVm.OwnersName,
                opt => opt.MapFrom(questionnaire => questionnaire.OwnersName))
             .ForMember(questionnaireVm => questionnaireVm.PetsName,
                opt => opt.MapFrom(questionnaire => questionnaire.PetsName))
             .ForMember(questionnaireVm => questionnaireVm.PhoneNumber,
                opt => opt.MapFrom(questionnaire => questionnaire.PhoneNumber));
    }
}
