
export interface BondInfo {
  product_id: string,
  product_description: string,
  isin: string,
  sector: string,
  s_and_p_rating: string,
  bond_type: string,
  coupon_rate: number,
  maturity_date: string,
  is_golden?: boolean;
  bond_issuer: string,
  b_size_m: number,
  a_size_m: number,
  b_yield: number,
  a_yield: number,
  bid_price: number,
  ask_price: number,
  b_spread: number,
  a_spread: number,
  b_gspread: number,
  a_gspread: number,
  b_zspread: number,
  a_zspread: number,
  b_axe: string,
  s_axe: string,
  benchmark: string,
  desk_code: string,
  fitch_rating: string,
  moody_rating: string,
  trader: string,
  creation_date: string,
  creation_time: string,
  bond_category: string,
  issuer_ticker: string,
  upload_date: string,
}

export interface TopRecommendation {
  company?: string;
  overview?: string;
  clients_to_contact?: string[];
  reasoning?: string;
  news?: any[];
  current_axes?: any[];
}

export interface RecommendedClient {
  client_name: string;
  score: number;
}

export interface RecommendedBond {
  product_id: string;
  product_description: string;
  isin: string;
  sector: string;
  s_and_p_rating: string;
  bond_type: string;
  coupon_rate: number;
  maturity_date: string;
  maturity_year: number;
  score: number;
}

export interface RecommendedBondInHolding {
  bond_description: string;
  bond_isin: string;
  score: number;
  issuer_name: string;
  par_held: number;
  par_change: number;
  security: string;
  client_name: string;
}

export interface ClientTrade {
  institution_name: string;
  security: string;
  trade_status: string;
  date: Date;
  amount: number;
  trade_type: string;
  spread: number;
  price: number;
  product_description: string;
}

export interface NewsArticle {
  title: string;
  date: Date;
  source: string;
  url: string;
  text: string | null;
  image_url: string | null;
  type: string;
}