export interface BloombergEmailReport {
  subject?: string;
  sender?: string;
  received_date?: string;
  html_content?: string;
}

export interface TreasuryYield {
  name: string;
  rate: number
  one_day_change_bps: number
  ytd_change_bps: number;
}