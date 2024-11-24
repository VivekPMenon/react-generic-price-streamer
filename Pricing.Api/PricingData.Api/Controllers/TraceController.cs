using Microsoft.AspNetCore.Mvc;
using PricingData.Api.Interfaces;
using PricingData.Api.Model;

namespace PricingData.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TraceController : ControllerBase
    {        
        private readonly ILogger<TraceController> _logger;
        private readonly ITraceRepository _traceRepository;

        public TraceController(ILogger<TraceController> logger, ITraceRepository traceRepository)
        {
            _logger = logger;
            _traceRepository = traceRepository;
        }

        [HttpGet]
        public IEnumerable<Trace> Get()
        {
            return _traceRepository.GetTraces();   
        }
    }
}
