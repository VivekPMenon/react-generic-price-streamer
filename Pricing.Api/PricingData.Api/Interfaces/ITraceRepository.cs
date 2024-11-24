using PricingData.Api.Model;

namespace PricingData.Api.Interfaces
{
    public interface ITraceRepository
    {
        public List<Trace> GetTraces();
    }
}
