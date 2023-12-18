using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Collars.Queries.GetCollar;

public record GetCollarQuery : IRequest<CollarVm>
{
    public string SecretKey { get; set; }
}

internal record GetCollarQueryHandler : IRequestHandler<GetCollarQuery, CollarVm>
{
    private readonly IAppDbContext _appDbContext;
    private readonly IMapper _mapper;

    public GetCollarQueryHandler(IAppDbContext appDbContext, IMapper mapper)
        => (_appDbContext, _mapper) = (appDbContext, mapper);
    
    public async Task<CollarVm> Handle(GetCollarQuery request, CancellationToken cancellationToken)
    {
        var entity = await _appDbContext.Collars
            .Where(c => c.SecretKey == request.SecretKey)
            .FirstOrDefaultAsync(cancellationToken) ?? throw new NotFoundException();

        return _mapper.Map<CollarVm>(entity);
    }
}