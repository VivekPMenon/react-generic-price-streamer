export interface BloombergEmailReport {
  subject?: string;
  sender?: string;
  received_date?: string;
  html_content?: string;
}

export interface TreasuryYield extends IInstrument {
  name: string;
  group_name: string;
  ticker?: string;
  rate: number
  one_day_change_bps?: number
  ytd_change_bps?: number;
  type?: MarketDataType;
}

export interface Bond {
  Bond: string;
  Country: string;
  Maturity: string;
  Bond_Yield: number;
  Day_Chang: number;
  Date: Date;
  YTD: number;
}

export interface BondData {
  country: string;
  bonds: TreasuryYield[];
  timestamp: Date;
}

export interface FxRate extends IInstrument {
  name: string;
  ticker: string;
  group_name: string;
  price: number
  change: number
  change_percentage: number;
}

export interface CryptoCurrency extends IInstrument{
  name: string;
  ticker: string;
  price: number
  change: number
  change_percentage: number;
}

export interface EquityFuture extends IInstrument {
  name: string;
  group_name: string;
  symbol: string;
  value: number;
  net_change: number;
  percent_change: number;
}

export interface IInstrument {
  name: string;
  group_name: string;
  symbol: string;
  value?: number;
  change?: number;
  percent?: number;
  type?: MarketDataType;
}

export enum MarketDataType {
  NONE = 'none',
  DOMESTIC_TREASURY = 'domestic_treasury',
  FOREIGN_TREASURY = 'foreign_treasury'
}
