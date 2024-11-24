namespace PricingData.Api.Model
{
    public class Trace
    {
        public string TradeID { get; set; }
        public DateTime ExecutionDate { get; set; }
        public string ExecutionTime { get; set; }
        public string SecurityID { get; set; }
        public string SecurityType { get; set; }
        public string BuySellIndicator { get; set; }
        public decimal TradePrice { get; set; }
        public int TradeQuantity { get; set; }
        public string CounterpartyID { get; set; }
        public DateTime TradeDate { get; set; }
        public DateTime SettlementDate { get; set; }
        public string ExecutionVenue { get; set; }
        public decimal Yield { get; set; }
        public decimal Spread { get; set; }
        public string TradeStatus { get; set; }
        public string ReportingPartyID { get; set; }
        public string ContraPartyID { get; set; }
        public string TradeReportingType { get; set; }
        public string Currency { get; set; }
        public PriceNotation PriceNotation { get; set; }
        public TransactionFee TransactionFee { get; set; }
        public string SpecialCondition { get; set; }
    }

    public class PriceNotation
    {
        public string NotationType { get; set; }
        public decimal Value { get; set; }
    }

    public class TransactionFee
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; }
    }
}
