using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Enums;
using Domain.Core.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Questionnaires.Commands.UpdateQuestionnaire;

public record UpdateQuestionnaireCommand : IRequest<Guid>
{
    public Guid Id { get; set; }

    public string OwnersName { get; set; }

    public string PetsName { get; set; }

    public string PhoneNumber { get; set; }
}
internal record UpdateQuestionnaireCommandHandler : IRequestHandler<UpdateQuestionnaireCommand, Guid>
{
    private readonly IAppDbContext _appDbContext;
    private readonly IExecutionContextAccessor _executionContextAccessor;

    public UpdateQuestionnaireCommandHandler(IAppDbContext appDbContext, IExecutionContextAccessor executionContextAccessor) 
        => (_appDbContext, _executionContextAccessor) = (appDbContext, executionContextAccessor);
    
    public async Task<Guid> Handle(UpdateQuestionnaireCommand request, CancellationToken cancellationToken)
    {
        var userId = _executionContextAccessor.UserId;

        var entity = await _appDbContext.Questionnaires
            
            .Include(q => q.Collar)
            .Where(x => x.Id == request.Id).FirstOrDefaultAsync(cancellationToken) ?? throw new NotFoundException();

        if (entity.Collar.UserId != userId)
        {
            throw new NotFoundException("Entity was not found");
        }
        
        entity.OwnersName = request.OwnersName;
        entity.PetsName = request.PetsName;
        entity.PhoneNumber = request.PhoneNumber;
        entity.State = QuestionnaireStates.Filled; //Вынести в enum, возможно сстоит прикрутить стейт машину, если потребуется
        
        entity.AddDomainEvent(new QuestionnaireUpdatedEvent());

        await _appDbContext.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
