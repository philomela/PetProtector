using Domain.Core;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Profiles.Queries;

//public record GetProfileQuery : IRequest<ProfileVm>
//{
//    public string UserId { get; set; }
//}

//public record GetProfileQuery : IRequestHandler<GetProfileQuery, ProfileVm>
//{
//    private readonly UserManager<AppUser> _userManager;
//    public GetProfileQuery(UserManager<AppUser> userManager) => _userManager = userManager;

//    public async Task<ProfileVm> Handle(GetProfileQuery request, CancellationToken cancellationToken)
//    {
//        var userInfo = await _userManager.
//    }
//}
