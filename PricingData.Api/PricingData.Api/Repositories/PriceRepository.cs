using System.Diagnostics;
using System.Text.Json;
using PricingData.Api.Interfaces;
using PricingData.Api.Model;
using Trace = PricingData.Api.Model.Trace;

namespace PricingData.Api.Repositories
{
    public class PriceRepository : IPriceRepository
    {
        private readonly IWebHostEnvironment _env;

        public PriceRepository(IWebHostEnvironment env)
        {
            _env = env;
        }

        public List<Price> GetPrices()
        {
            var dataFilePath = Path.Combine(_env.ContentRootPath, "data", "Instruments.json");

            // Read the JSON file
            var jsonData = File.ReadAllText(dataFilePath);

            // Deserialize JSON into C# objects
            return JsonSerializer.Deserialize<List<Price>>(jsonData);
        }
    }
}
