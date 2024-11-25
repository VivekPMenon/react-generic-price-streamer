export interface SecurityData {
  id: string;
  ticker: string;
  cusip: string;
  isin: string;
  sedol: string;
  coupon: string;
  maturity: string;
  security: string;
  quoteType: string;
  bmkIsin: string;
  bid: string;
  ask: string;
  bidYield: string;
  askYield: string;
  bidSpread: string;
  askSpread: string;
}

export interface TradeData {
  tradeID: string;
  executionDate: string;
  executionTime: string;
  securityID: string;
  securityType: string;
  buySellIndicator: string;
  tradePrice: number;
  tradeQuantity: number;
  counterpartyID: string;
  tradeDate: string;
  settlementDate: string;
  executionVenue: string;
  yield: number;
  spread: number;
  tradeStatus: string;
  reportingPartyID: string;
  contraPartyID: string;
  tradeReportingType: string;
  currency: string;
  priceNotation: {
    notationType: string;
    value: number;
  };
  transactionFee: {
    amount: number;
    currency: string;
  };
  specialCondition: string;
}
