using Application.Common.Interfaces;
using System.Security.Claims;

namespace WebApi.Configurations
{
    public class ExecutionContextAccessor : IExecutionContextAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ExecutionContextAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid UserId
        {
            get
            {
                if (_httpContextAccessor
                    .HttpContext?
                    .User?
                    .Claims?
                    .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?
                    .Value != null)
                {
                    return Guid.Parse(_httpContextAccessor.HttpContext.User.Claims.Single(
                        x => x.Type == ClaimTypes.NameIdentifier).Value);
                }

                throw new ApplicationException("User context is not available");
            }
        }
        
        //string EmailAddress добавить

        //public Guid CorrelationId
        //{
        //    get
        //    {
        //        if (IsAvailable && _httpContextAccessor.HttpContext.Request.Headers.Keys.Any(
        //            x => x == CorrelationMiddleware.CorrelationHeaderKey))
        //        {
        //            return Guid.Parse(
        //                _httpContextAccessor.HttpContext.Request.Headers[CorrelationMiddleware.CorrelationHeaderKey]);
        //        }

        //        throw new ApplicationException("Http context and correlation id is not available");
        //    }
        //}
    }
}
