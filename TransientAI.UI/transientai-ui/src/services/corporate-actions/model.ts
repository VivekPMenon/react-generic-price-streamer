
export interface AccountDetail {
  accountNumber?: string;
  accountReference?: string;
  holdingQuantity?: string;
  deadline?: string;
  grossAmount?: string;
  taxWithheld?: string;
  netAmount?: string;
}
export interface TermsDetail {
  termNumber?: string;
  type?: string;
  payDate?: string;
  rate?: string;
  currency?: string;
  isDefault: boolean;
}

export interface SecurityIdentifier {
  isin?: string;
  ticker?: string;
  cusip?: string;
}

export interface Security {
  name?: string;
  identifiers?: SecurityIdentifier[];
  countryOfIssue?: string;
  countryOfIssuer?: string;
}

export interface CorporateActionDates {
  notification_date?: string;
  pay_date?: string;
  record_date?: string;
  ex_date?: string;
  deadline?: string;
}

export interface Account {
  accountNumber?: string;
  accountReference?: string;
  holdingQuantity?: string;
  deadline?: string;
  grossAmount?: string;
  taxWithheld?: string;
  netAmount?: string;
}

export interface Terms {
  ternNumber?: string;
  type?: string;
  payDate?: string;
  rate?: string;
  currency?: string;
  isDefault?: boolean;
}

export interface Requirements {
  action_required?: boolean;
  response_options: any[];
}

export interface Distribution {
  type?: string;
  rate?: string;
  currency?: string;
}

export interface Commentary {
  comments?: string;
}

export interface VersionDetails {
  version?: number;
  changedDate?: string;
  emailRef?: string;
  changedFields: string[];
  changeSummary?: string;
  isCurrent?: boolean;
}

export interface CorporateActionDetail {
  eventId?: string;
  eventType?: string;
  eventClassification?: string;
  eventStatus?: string;
  security?: Security;
  dates?: CorporateActionDates;
  accounts?: Account[];
  terms?: Terms[];
  requirements?: Requirements;
  distribution?: Distribution;
  gsCommentary?: Commentary;
  updates?: {[key:string]: string};
  version?: number;
  versionHistory?: VersionDetails[];
}

export interface CorporateAction {
  action?: string;
  isin?: string;
  id?: string;
  security?: string;
  keyDates?: string;
  version?: string;
  actionRequired?: string;
  deadlineDate?: string;
  accountDetails?: AccountDetail[];
  termsDetails?: TermsDetail[];

  eventId?: string;//
  eventType?: string;//
  eventStatus?: string;//
  // eventDate?: string;
  // securityId?: string;
  ticker?: string;//
  // securityName?: string;
  // eventDescription?: string;
  // accountId?: string;
  // termDetails?: string;
  // entitledProductId?: string;
  // paydate?: string;
  holdingQuantity?: number;//
  // updateHistory?: UpdateHistory[];
  // latestVersion?: number;
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