

export interface CorporateAction {
  eventId?: string;
  eventType?: string;
  eventStatus?: string;
  eventDate?: string;
  securityId?: string;
  ticker?: string;
  securityName?: string;
  eventDescription?: string;
  accountId?: string;
  termDetails?: string;  
  entitledProductId?: string;
  paydate?: string;
  holdingQuantity?: string;
  updateHistory?: UpdateHistory[];
  latestVersion?: number;
}

export interface UpdateHistory {
  type?: any;
  date?: string;
  email?: string;
  alert?: string;
}

export interface CorpActionsData {
  corpActions?: CorporateAction[];
}

export interface CorpActionsDataContextType {
  corpActionsData: CorpActionsData;
  setCorpActionsData: (data: CorpActionsData) => void;
}