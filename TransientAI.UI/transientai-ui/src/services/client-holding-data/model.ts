
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