﻿using Application.Common.Mappings;
using AutoMapper;
using Domain.Core.Entities;

namespace Application.Users.Queries;

public record GetUserQueryVm : IMapWith<AppUser>
{
    public string FullName { get; set; }

    public string Email { get; set; }

    public DateTime? CreatedAt { get; set; }
    
    public string Avatar { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<AppUser, GetUserQueryVm>()
            .ForMember(userVm => userVm.FullName,
                opt => opt.MapFrom(user => user.FullName))
            .ForMember(userVm => userVm.Email,
                opt => opt.MapFrom(user => user.Email))
            .ForMember(userVm => userVm.CreatedAt,
                opt => opt.MapFrom(user => user.CreatedAt))
            .ForMember(userVm => userVm.Avatar, opt => opt.MapFrom(user => user.Avatar));
    }
}