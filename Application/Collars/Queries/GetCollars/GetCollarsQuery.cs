using Application.Collars.Queries.Dtos;
using Application.Common.Interfaces;
using Application.Questionnaires.Queries.Dtos;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Collars.Queries.GetCollars;

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

        var entities = await _appDbContext.Collars.AsNoTracking()
            .Include(c => c.Questionnaire).AsNoTracking()
            .Where(c => c.UserId == userId)
            .Select(c => new CollarDto()
            {
                Id = c.Id,
                Questionnaire = new ()
                {
                    OwnersName = c.Questionnaire.OwnersName,
                    PetsName = c.Questionnaire.PetsName,
                    PhoneNumber = c.Questionnaire.PhoneNumber
                }
            }).ToListAsync(cancellationToken);
        
        return _mapper
            .Map<CollarsVm>(entities);
    }
}