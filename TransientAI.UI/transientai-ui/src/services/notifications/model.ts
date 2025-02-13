
export interface Notification {
  title?: string;
  subTitle?: string;
  type?: NotificationType;
  highlights?: string[];
  id?: string;
} 

export enum NotificationType {
  Axes ='Axes',
  Clients = 'Client',
  Trades = 'Trades',
  CorpAct = 'Corp Act',
  Research = 'Research'
}