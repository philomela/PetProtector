using Application.Collars.Queries.Dtos;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Core.Entities;

namespace Application.Collars.Queries.GetCollars;

public class CollarsVm : IMapWith<Collar>
{
    public IReadOnlyCollection<CollarDto> Collars { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<List<CollarDto>, CollarsVm>()
            .ForMember(collarsVm => collarsVm.Collars,
                opt => opt.MapFrom(collars => collars));
    }
}