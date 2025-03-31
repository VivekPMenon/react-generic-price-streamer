export interface IPmCorporateAction {
  eventId: string;
  actionType: string;
  ticker: string;
  securityName: string;
  eventType: string;
  eventStatus: string;
  eventClassification: string;
  isin: string;
  cusip: string;
  sedol: string;
  ric: string;
  security: {
    name: string;
    ticker: string;
    isin: string;
    cusip: string;
    sedol: string;
    ric: string;
  };
  dates: {
    pay_date: string;
    record_date: string;
    ex_date: string;
    deadline: string;
  };
  keyDates: string;
  distribution: {
    rate: string;
    currency: string;
  };
  accounts: Array<{
    accountNumber: string;
    holdingQuantity: string;
    grossAmount?: string;
    netAmount?: string;
    taxWithheld?: string;
    accountReference?: string;
  }>;
  numAccounts: number;
  countryOfIssue: string;
  countryOfIssuer: string;
  versionInfo: string;
  defaultAction: string;
  receivedDate: string;
  actionRequired: boolean;
  holdingQuantity: number;
  deadlineDate: string;
  version: number;
  emailRef: string;
  emailDate: string;
  emailHtmlUrl: string;
  latestUpdateEmail: string;
  latestUpdateDate: string;
  changedFields: string[];
  changeSummary: string;
  isUpdate: string;
  originalDate: string;
  updateSequence: string[];
  changesSummary: string[];
  versionsInfo: Array<{
    versionId: number;
    emailRef: string;
    date: string;
    emailHtmlUrl: string;
    isCurrent: boolean;
    changedFields?: string[];
    changeSummary?: string;
    changes?: string[];
    receivedDate?: string;
    stateEmailId?: string;
    accounts?: Array<{
      accountNumber: string;
      accountReference?: string;
      holdingQuantity: string;
    }>;
    actionRequired?: boolean;
    responseOptions?: string[];
    defaultAction?: string;
  }>;
}