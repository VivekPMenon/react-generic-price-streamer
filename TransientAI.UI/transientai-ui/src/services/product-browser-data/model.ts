
export interface BondInfo {
  product_id: string,
  product_description: string,
  isin: string,
  sector: string,
  s_and_p_rating: string,
  bond_type: string,
  coupon_rate: 0,
  maturity_date: string
  is_golden?: boolean;
  
  // bond_issuer?: string;
  // coupon_rate?: string;
  // b_size_m?: number;
  // a_size_m?: number;
  // b_yield?: number;
  // a_yield?: number;
  // bid_price?: number;
  // ask_price?: number;
  // b_spread?: number;
  // a_spread?: number;
  // b_gspread?: number;
  // a_gspread?: number;
  // b_zspread?: number | null;
  // a_zspread?: number | null;
  // sector?: string;
  // b_axe?: string;
  // s_axe?: string;
  // benchmark?: string;
  // desk_code?: string;
  // fitch_rating?: string | null;
  // moody_rating?: string;
  // trader?: string;
  // level?: number | null;
}

export interface TopRecommendation {
  company?: string;
  overview?: string;
  clients_to_contact?: string[];
  reasoning?: string;
  news?: any[];
  current_axes?: any[];
}