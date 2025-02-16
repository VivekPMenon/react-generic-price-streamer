export interface ChartSummary {
  image: string,
  description?: string;
}

export interface ResearchReport {
  id?: string;
  name?: string;
  emailSource?: string;
  aiSummary?: string;
  charts?: Array<ChartSummary>;
  keywords?: Array<string>;
}

export interface RiskReport {
  portfolio?: string;
  reportType?: string;
  date?: string;
  pdfSource?: string;
}