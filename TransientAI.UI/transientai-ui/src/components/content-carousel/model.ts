export enum EContentTypes{
    NOTIFICATION = 'Notification',
    PNLMATRICS = 'PnlMatrics'
}


export interface CarouselNotification {
    title?: string;
    type?: CarouselNotificationType;
    id?: string;
    timestamp?: number;
    resourceName?: string;
    time?: string
  }
  
  export enum CarouselNotificationType {
    BreakNews = 'Break News',
    Axes = 'Axes',
    Clients = 'Client',
    Trades = 'Trades',
    CorpAct = 'Corp Act',
    Research = 'Research',
    RiskReport = 'Risk Report',
    Inquiries = 'Inquiries',
    All = 'All',
    Macro = 'Macro'
  }