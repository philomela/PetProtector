using Application.Common.Mappings;
using AutoMapper;
using Domain.Core.Entities;

namespace Application.Collars.Queries.GetCollar;

public class CollarVm : IMapWith<Collar>
{
    public Guid Id { get; set; }
    
    public void Mapping(Profile profile)
    {
        profile.CreateMap<Collar, CollarVm>()
            .ForMember(collarVm => collarVm.Id,
                opt => opt.MapFrom(collar => collar.Id));
    }
}