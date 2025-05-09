﻿using Application.Common.Interfaces;
using Domain.Core.Entities;
using Domain.Core.Events;
using Domain.Core.Enums;
using MediatR;

namespace Application.Collars.Commands.CreateCollar;

public record CreateCollarCommand : IRequest<Unit>
{
    public Guid Id { get; } = Guid.NewGuid();

    public string SecretKey { get; set; }
    
    public Guid LinkQuestionnaire { get; } = Guid.NewGuid();
}

internal record CreateCollarCommandHandler : IRequestHandler<CreateCollarCommand, Unit>
{
    private readonly IAppDbContext _appDbContext;
    private readonly IExecutionContextAccessor _executionContextAccessor;

    public CreateCollarCommandHandler(IAppDbContext appDbContext, IExecutionContextAccessor executionContextAccessor) 
        => (_appDbContext, _executionContextAccessor) = (appDbContext, executionContextAccessor);

    
    public async Task<Unit> Handle(CreateCollarCommand request, CancellationToken cancellationToken)
    {
        //todo: Не добавлять браслет с имеющимся secretKey, может быть уникальный ключ и индекс повесить на secretKey
        var entity = new Collar()
        {
            Id = request.Id,
            SecretKey = request.SecretKey,
            Questionnaire = new Questionnaire()
            {
                Id = request.Id,
                LinkQuestionnaire = request.LinkQuestionnaire,
                State = QuestionnaireStates.WaitingFilling,
            },
        };
        
        entity.AddDomainEvent(new CollarCreatedEvent(entity.Id));
        
        await _appDbContext.Collars.AddAsync(entity, cancellationToken);

        await _appDbContext.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}