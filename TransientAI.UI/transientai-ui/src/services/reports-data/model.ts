import i18n from '../../i18n';

export interface ImageItem {
  url: string;
  title?: string;
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

// ✅ Enum for type-safe logic and usage
export enum ReportType {
  Abstract = 'abstract',
  ExecutiveSummary = 'executive_summary',
  Detailed = 'detailed',
}

// ✅ Separate label map for translations
export const ReportTypeLabels = {
  [ReportType.Abstract]: i18n.t('full_view'),
  [ReportType.ExecutiveSummary]: i18n.t('executive_summary'),
  [ReportType.Detailed]: i18n.t('detailed'),
};
