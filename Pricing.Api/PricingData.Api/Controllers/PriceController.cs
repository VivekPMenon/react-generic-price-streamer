using Microsoft.AspNetCore.Mvc;
using PricingData.Api.Interfaces;
using PricingData.Api.Model;

namespace PricingData.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PriceController : ControllerBase
    {        
        private readonly ILogger<TraceController> _logger;
        private readonly IPriceRepository _priceRepository;

        public PriceController(ILogger<TraceController> logger, IPriceRepository priceRepository)
        {
            _logger = logger;
            _priceRepository = priceRepository;
        }

        [HttpGet]
        public IEnumerable<Price> Get()
        {
            return _priceRepository.GetPrices();   
        }
    }
}
