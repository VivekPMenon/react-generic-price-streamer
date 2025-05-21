import {MarketData} from "@/services/market-data";

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
  rate: number;
  intraday_data?: MarketData[];
  one_day_change_bps?: number;
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
  symbol: string;
  group: string;
  current_price: number
  change: number
  percent_change: number;
  data?: MarketData[];
}

export interface CryptoCurrency extends IInstrument{
  name: string;
  symbol: string;
  current_price: number
  change: number
  percent_change: number;
  data?: MarketData[];
}

export interface EquityFuture extends IInstrument {
  name: string;
  group_name: string;
  symbol: string;
  current_price: number;
  change: number;
  percent_change: number;
  data?: MarketData[];
  timestamp: Date;
}

export interface IInstrument {
  name: string;
  group_name: string;
  symbol: string;
  value?: number;
  change?: number;
  percent?: number;
  type?: MarketDataType;
  marketData?: MarketData[];
}

export enum MarketDataType {
  UNKNOWN = 'none',
  EQUITY = 'equity',
  FUTURES = 'futures',
  CRYPTOCURRENCY = 'cryptocurrency',
  FX = 'fx',
  DOMESTIC_TREASURY = 'domestic_treasury',
  FOREIGN_TREASURY = 'foreign_treasury'
}

export enum MarketDataInterval {
  ONE_MIN = '1min',
  FIVE_MIN = '5min',
  FIFTEEN_MIN = '15min',
  THIRTY_MIN = '30min',
  ONE_HOUR = '1hour',
}