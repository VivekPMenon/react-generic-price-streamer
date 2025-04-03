

export interface GraphDataPoint {
  x_label?: string;
  date?: string;
  mid_yield?: string;
}

export interface Price {
  bond: string;
  bond_issuer: string;
  date: string;
  isin: string;
  mid_price: number;
  mid_spread: number;
  mid_yield: number;
  source: string;
  time: string;
}

export interface TraceData {
  asw: number | null;
  coupon: number;
  date: string;
  isin: string;
  maturity: string;
  price_change: number;
  rating: string;
  security: string;
  side: string;
  size_m: number;
  spread_change: number;
  time: string;
  traded_price: number;
  traded_spread: number;
  traded_yield: number;
  yield_change: number;
}

export interface MarketData {
  date?: Date;
  timestamp?: Date;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface FinancialData {
  revenue?: number;
  net_income?: number;
  diluted_eps?: number;
  net_profit_margin?: number;
  yoy_revenue?: number;
  yoy_net_income?: number;
  yoy_eps?: number;
  yoy_net_profit_margin?: number;
  eps_surprise?: number;
  revenue_surprise?: number;
  eps_beat?: string;
  revenue_beat?: string;
  latest_quarter_date?: string;
  latest_quarter?: string;
}

export enum PeriodType {
  ONE_DAY = '1d',
  THREE_DAY = '3d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1mo',
  THREE_MONTH = '3mo',
  SIX_MONTH = '6mo',
  ONE_YEAR = '1y',
  YEAR_TO_DATE = 'ytd',
  MAX = 'max'
}

export enum ImageType {
  SVG = 'svg',
  PNG = 'png',
  WEBP = 'webp',
  JPG = 'jpg'
}

export interface Instrument {
  ticker: string;
  company_name: string;
  marketData?: MarketData[];
  financials?: FinancialData;
  lastMarketData?: MarketData;
  previous_close?: number;
  current_price: number;
  change: number;
  percent_change: number;
  timestamp: Date;
  dispose: null|(() => void);
}