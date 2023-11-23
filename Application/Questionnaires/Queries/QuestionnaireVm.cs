using Application.Common.Mappings;
using AutoMapper;
using Domain.Core;

namespace Application.Questionnaires.Queries;

public record QuestionnaireVm : IMapWith<Questionnaire>
{
    public Guid Id { get; set; }

    public string OwnersName { get; set; }

    public string PetsName { get; set; }

    public string PhoneNumber { get; set; }

    public string State { get; set; }

    public string SecretKey { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<Questionnaire, QuestionnaireVm>()
            .ForMember(questionnaireVm => questionnaireVm.Id,
                opt => opt.MapFrom(questionnaire => questionnaire.Id))
             .ForMember(questionnaireVm => questionnaireVm.OwnersName,
                opt => opt.MapFrom(questionnaire => questionnaire.OwnersName))
             .ForMember(questionnaireVm => questionnaireVm.PetsName,
                opt => opt.MapFrom(questionnaire => questionnaire.PetsName))
             .ForMember(questionnaireVm => questionnaireVm.PhoneNumber,
                opt => opt.MapFrom(questionnaire => questionnaire.PhoneNumber))
             .ForMember(questionnaireVm => questionnaireVm.State,
                opt => opt.MapFrom(questionnaire => questionnaire.State))
             .ForMember(questionnaireVm => questionnaireVm.SecretKey,
                opt => opt.MapFrom(questionnaire => questionnaire.SecretKey));
    }
}
