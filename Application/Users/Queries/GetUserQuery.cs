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

    public GetUserQueryHandler(
        IExecutionContextAccessor executionContextAccessor, 
        IMapper mapper, 
        UserManager<AppUser> userManager)
        => (_executionContextAccessor, _mapper, _userManager) = (executionContextAccessor, mapper, userManager);

    public async Task<GetUserQueryVm> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var userId = _executionContextAccessor.UserId;

        return _mapper.Map<GetUserQueryVm>(await _userManager.FindByIdAsync(userId.ToString())) 
               ?? throw new NotFoundException("User was not found");
    }
}
