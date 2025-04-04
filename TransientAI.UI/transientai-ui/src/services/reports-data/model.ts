import i18n from '../../i18n';
export interface ImageItem {
  url: string,
  title?: string,
  description?: string;
}

export interface ResearchReport {
  id?: string;
  name?: string;
  emailSource?: string;
  aiSummary?: string;
  sender?: string;
  received_date?: string;
  concise_summary?: string;
  keywords?: Array<string>;
}

export interface RiskReport {
  portfolio?: string;
  reportType?: string;
  date?: string;
  pdfSource?: string;
  uploadedBy?: string;
  uploadStatus?: string;
}

export interface ReportSummary {
  content?: string;
  images?: Array<ImageItem>;
}

export enum ReportType {
  Abstract = i18n.t('full_view'),
  Detailed = i18n.t('detailed'),
  ExecutiveSummary = i18n.t('executive_summary'),
}