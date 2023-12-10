using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Collars.Queries;

public record GetCollarsQuery : IRequest<CollarsVm>
{
}

internal record GetCollarsQueryHandler : IRequestHandler<GetCollarsQuery, CollarsVm>
{
    private readonly IExecutionContextAccessor _executionContextAccessor;
    private readonly IAppDbContext _appDbContext;
    private readonly IMapper _mapper;

    public GetCollarsQueryHandler(
        IExecutionContextAccessor executionContextAccessor,
        IAppDbContext appDbContext,
        IMapper mapper) => (_executionContextAccessor, _appDbContext, _mapper)
        = (executionContextAccessor, appDbContext, mapper);

    public async Task<CollarsVm> Handle(GetCollarsQuery request, CancellationToken cancellationToken)
    {
        var userId = _executionContextAccessor.UserId;

        return _mapper.Map<CollarsVm>(await _appDbContext.Collars.Where(c => c.UserId == userId).ToListAsync());
    }
}