﻿using Application.Common.Interfaces;
using System.Security.Claims;

namespace WebApi.Configurations
{
    public class ExecutionContextAccessor : IExecutionContextAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;

        public ExecutionContextAccessor(
            IHttpContextAccessor httpContextAccessor, 
            IConfiguration configuration) => 
            (_httpContextAccessor, _configuration) 
            = (httpContextAccessor, configuration);
        

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

        public string BaseUrl => _configuration["BaseUrl"]!;

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