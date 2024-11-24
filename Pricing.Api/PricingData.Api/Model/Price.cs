namespace PricingData.Api.Model
{
    public class Price
    {
        public string Id { get; set; }
        public string Ticker { get; set; }
        public string Cusip { get; set; }
        public string Isin { get; set; }
        public string Sedol { get; set; }
        public string Coupon { get; set; }
        public string Maturity { get; set; }
        public string Security { get; set; }
        public string QuoteType { get; set; }
        public string BmkIsin { get; set; }
        public string Bid { get; set; }
        public string Ask { get; set; }
        public string BidYield { get; set; }
        public string AskYield { get; set; }
        public string BidSpread { get; set; }
        public string AskSpread { get; set; }
    }
}
