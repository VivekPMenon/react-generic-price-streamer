
export interface Notification {
  title?: string;
  subTitle?: string;
  type?: NotificationType;
  highlights?: string[];
} 

export enum NotificationType {
  Axes ='Axes',
  Clients = 'Client',
  Trades = 'Trades'
}