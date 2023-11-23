using Application.Common.Interfaces;
using MediatR;

namespace Application.Users.Queries;

public record GetUserQuery : IRequest<GetUserQueryVm>
{
    public string UserId { get; set; }
}

public record GetUserQueryHandler : IRequestHandler<GetUserQuery, GetUserQueryVm>
{
    //private readonly IExecutionContextAccessor _executionContextAccessor;

    //public GetUserQueryHandler(IExecutionContextAccessor executionContextAccessor)
    //    => (_executionContextAccessor, ) = (executionContextAccessor); 

    public async Task<GetUserQueryVm> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
