using Application.Common.Mappings;
using AutoMapper;
using Domain.Core;

namespace Application.Collars.Queries;

public class CollarsVm : IMapWith<List<Collar>>
{
    public List<Collar> Collars { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<List<Collar>, CollarsVm>()
            .ForMember(collarsVm => collarsVm.Collars,
                opt => opt.MapFrom(collars => collars));
    }
}