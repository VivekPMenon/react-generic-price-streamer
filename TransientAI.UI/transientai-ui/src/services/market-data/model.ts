

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
