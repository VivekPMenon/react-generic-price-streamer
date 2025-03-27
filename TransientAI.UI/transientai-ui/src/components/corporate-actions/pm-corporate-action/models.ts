export interface CorporateAction {
    event_id: string;
    action_type: string;
    ticker: string;
    security_name: string;
    event_type: string;
    event_status: string;
    event_classification: string;
    
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
    
    distribution: {
      rate: string;
      currency: string;
    };
    
    accounts: Array<{
      account_number: string;
      holding_quantity: string;
      gross_amount: string;
      net_amount: string;
      tax_withheld: string;
    }>;
    
    num_accounts: number;
    country_of_issue: string;
    country_of_issuer: string;
    version_info: string;
    default_action: string;
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
      changedFields: string[];
      changeSummary: string;
      // Optional fields from version 1
      receivedDate?: string;
      accounts?: Array<{
        accountNumber: string;
        accountReference: string;
        holdingQuantity: string;
      }>;
      actionRequired?: boolean;
      responseOptions?: string[];
      defaultAction?: string;
      changes?: any[];
      stateEmailId?: string;
    }>;
  }
