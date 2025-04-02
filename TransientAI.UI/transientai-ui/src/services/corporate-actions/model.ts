export interface SecurityIdentifier {
  isin?: string;
  ticker?: string;
  cusip?: string;
  ric?: string;
  sedol?: string;
  product_id?: string;
}

export interface Security {
  name?: string;
  identifiers?: SecurityIdentifier;
  countryOfIssue?: string;
  countryOfIssuer?: string;
}

export interface CorporateActionDates {
  notification_date?: string;
  pay_date?: string;
  record_date?: string;
  ex_date?: string;
  effective_date?: string;
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

export interface SecurityDetails {
  action?: string;
  product_id?: string;
}

export interface Terms {
  termNumber?: string;
  type?: string;
  payDate?: string;
  rate?: string;
  currency?: string;
  isDefault?: boolean;
  security_details?: SecurityDetails;
  liability?: string;
  response?: string;
}

export interface Requirements {
  action_required?: boolean;
  market_deadline_event_date?: string;
  deposit_date_event_date?: string;
  pay_date_event_date?: string;
  pay_date_response_date?: string;
  response_options?: string[],
  default_action?: string;
  instructions?: string[];
}

export interface Distribution {
  type?: string;
  rate?: string;
  currency?: string;
  calculation_details?: string;
}

export interface CommentaryUpdate {
  date?: string;
  content?: string;
  restrictions?: any[];
}

export interface OfferDetails {
  description?: string;
  conditions?: string[];
  availability?: string;
}

export interface Disclaimers {
  legal?: string[];
  tax?: string[];
  fees?: string[];
  general?: string[];
}

export interface Option {
  option_number?: string;
  description?: string;
  is_default?: boolean;
  price?: string;
  currency?: string;
}

export interface Commentary {
  full_text?: string;
  updates?: CommentaryUpdate[];
  offer_details?: OfferDetails;
  options?: Option[];
  disclaimers?: Disclaimers;
}

export interface VersionDetails {
  version?: number;
  changedDate?: string;
  emailRef?: string;
  changedFields: string[];
  changeSummary?: string;
  isCurrent?: boolean;
}

export interface Updates {
  is_update?: boolean;
  original_date?: string;
  update_sequence?: string[];
  changes?: string[];
}

export interface CorporateAction {
  eventId: string;
  eventType?: string;
  eventClassification?: string;
  eventStatus?: string;
  emailId?: string;
  emailHtmlUrl?: string;
  receivedDate?: string;
  security?: Security;
  dates?: CorporateActionDates;
  accounts?: Account[];
  terms?: Terms[];
  requirements?: Requirements;
  distribution?: Distribution;
  gsCommentary?: Commentary;
  updates?: Updates;
  version?: number;
  id?: string;
  action?: string;
  ticker?: string;
  isin?: string;
  holdingQuantity?: number;
  actionRequired?: boolean;
  deadlineDate?: string;
  keyDates?: string;
  responseOptions?: string[],
  received_date?: string;
  default_action?: string;
  versionHistory?: VersionDetails[];
  latest_update?: VersionDetails;
}

export interface CorporateActionFilterOptions {
  eventStatus?: string;
  eventType?: string;
  eventClassification?: string;
  actionRequired?: boolean;
  isin?: string;
  securityName?: string;
  eventId?: string;
  fromDate?: string;
  toDate?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
  accountId?: string;
  pageNumber?: number;
  pageSize?: number;
}