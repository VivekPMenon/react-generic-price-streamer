using PricingData.Api.Model;

namespace PricingData.Api.Interfaces
{
    public interface IPriceRepository
    {
        public List<Price> GetPrices();
    }
}
