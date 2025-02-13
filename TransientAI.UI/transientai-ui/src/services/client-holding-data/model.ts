
export interface ClientHolding {
  par_held: number;
  par_change: number;
  security: string;
  issuer_name: string;
  client_name: string;
  isin: string;
  market_value_percent: number;
  mkt_val: number;
  yield_to_mat: number;
  yield_to_worst: number;
  oas: number;
  bclass3: string;
  px_close: number;
}

export interface BondTrade {
  amount: number;
  benchmark: string;
  bond_issuer: string;
  bond_type: string;
  date: string; 
  institution_name: string;
  level: number;
  maturity: string; 
  price: number;
  security: string;
  spread: number;
  trade_status: string;
  trade_type: string;
  trader: string;
  yield_: number; 
}
