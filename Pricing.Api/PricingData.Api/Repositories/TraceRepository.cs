using System.Diagnostics;
using System.Text.Json;
using PricingData.Api.Interfaces;
using PricingData.Api.Model;
using Trace = PricingData.Api.Model.Trace;

namespace PricingData.Api.Repositories
{
    public class TraceRepository: ITraceRepository
    {
        private readonly IWebHostEnvironment _env;

        public TraceRepository(IWebHostEnvironment env) 
        {
            _env = env;
        }

        public List<Trace> GetTraces()
        {
            var dataFilePath = Path.Combine(_env.ContentRootPath, "data", "trace.json");

            // Read the JSON file
            var jsonData = File.ReadAllText(dataFilePath);

            // Deserialize JSON into C# objects
            return JsonSerializer.Deserialize<List<Trace>>(jsonData);
        }
    }
}
