export interface BloombergEmailReport {
  subject?: string;
  sender?: string;
  received_date?: string;
  html_content?: string;
}

export interface TreasuryYield {
  name: string;
  group_name: string;
  rate: number
  one_day_change_bps?: number
  ytd_change_bps?: number;
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

export interface FxRate {
  name: string;
  group_name: string;
  price: number
  change: number
  change_percentage: number;
}

export interface Crypto {
  name: string;
  price: number
  change: number
  change_percentage: number;
}

export interface EquityFuture {
  name: string;
  group_name: string;
  symbol: string;
  value: number;
  net_change: number;
  percent_change: number;
}