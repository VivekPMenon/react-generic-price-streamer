

export interface CorporateAction {
  eventId?: string;
  securityId?: string;
  eventDescription?: string;
  accountId?: string;
  termDetails?: string;  
  entitledProductId?: string;
  paydate?: string;
  holdingQuantity?: string;
  updateHistory?: UpdateHistory[];
}

export interface UpdateHistory {
  type?: any;
  date?: string;
  email?: string;
  alert?: string;
}