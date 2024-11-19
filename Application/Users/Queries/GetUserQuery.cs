using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.Queries;

public record GetUserQuery : IRequest<GetUserQueryVm>
{ }

internal record GetUserQueryHandler : IRequestHandler<GetUserQuery, GetUserQueryVm>
{
    private readonly IExecutionContextAccessor _executionContextAccessor;
    private readonly IMapper _mapper;
    private readonly UserManager<AppUser> _userManager;
    private readonly IRedisCache _cache;

    public GetUserQueryHandler(
        IExecutionContextAccessor executionContextAccessor, 
        IMapper mapper, 
        UserManager<AppUser> userManager,
        IRedisCache cache)
        => (_executionContextAccessor, _mapper, _userManager, _cache) 
            = (executionContextAccessor, mapper, userManager, cache);

    public async Task<GetUserQueryVm> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var userId = _executionContextAccessor.UserId;

        var cacheKey = $"user-{userId}";
        
        var user = await _cache.GetAsync<AppUser>(cacheKey, cancellationToken);

        if (user is not null)
        {
            return _mapper.Map<GetUserQueryVm>(user);
        }
        
        user = await _userManager.FindByIdAsync(userId.ToString())
               ?? throw new NotFoundException("User was not found");

        await _cache.SetAsync(cacheKey, user, cancellationToken, TimeSpan.FromMinutes(5));
           
        return _mapper.Map<GetUserQueryVm>(user);
    }
}