export interface Notification {
  title?: string;
  subTitle?: string;
  sideTitle?: string;
  type?: NotificationType;
  highlights?: string[];
  id?: string;
  timestamp?: number;
  resourceName?: string;
}

export enum NotificationType {
  BreakNews = 'Break News',
  Axes = 'Axes',
  Clients = 'Client',
  Trades = 'Trades',
  CorpAct = 'Corp Act',
  Research = 'Research',
  RiskReport = 'Risk Report',
  Inquiries = 'Inquiries',
  Macro = 'Macro',
  PmsPnl = 'PMS',
  All = 'All',
}
