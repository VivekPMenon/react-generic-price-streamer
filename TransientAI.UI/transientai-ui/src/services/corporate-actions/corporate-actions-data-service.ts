import { webApihandler } from "../web-api-handler";
import { CorporateAction } from "./model";
import corpActionsRaw from './corp-actions.json'

class CorporateActionsDataService {

  getCorpActions(): CorporateAction[] {
    return [
      {
        eventId: '83778079',
        accountId: corpActionsRaw['83778079'].current_state.accounts[0].account_number,
        holdingQuantity: corpActionsRaw['83778079'].current_state.accounts[0].holding_quantity,
        entitledProductId: corpActionsRaw['83778079'].current_state.terms[0].security_details.product_id!,
        eventDescription: `Mandatory Event Information 
          Update: ${corpActionsRaw['83778079'].current_state.event_type}: ${corpActionsRaw['83778079'].current_state.security.name}, 
          ISIN: ${corpActionsRaw['83778079'].current_state.security.identifiers.isin}`,
        termDetails: `${corpActionsRaw['83778079'].current_state.terms[0].term_number} ${corpActionsRaw['83778079'].current_state.terms[0].type}`,
        paydate: corpActionsRaw['83778079'].current_state.terms[0].pay_date!,
        updateHistory: corpActionsRaw['83778079'].update_history?.map(history => ({
          alert: 'Y',
          email: 'Y',
          date: history.timestamp?.replace(' +0000', ''),
          type: history.version!
        }))
      },
      {
        eventId: '83526858',
        accountId: corpActionsRaw['83526858'].current_state.accounts[0].account_number,
        holdingQuantity: corpActionsRaw['83526858'].current_state.accounts[0].holding_quantity,
        entitledProductId: corpActionsRaw['83526858'].current_state.terms[0].security_details.product_id!,
        eventDescription: `Mandatory Event Information 
          Update: ${corpActionsRaw['83526858'].current_state.event_type}: ${corpActionsRaw['83526858'].current_state.security.name}, 
          ISIN: ${corpActionsRaw['83526858'].current_state.security.identifiers.isin}`,
        termDetails: `${corpActionsRaw['83526858'].current_state.terms[0].term_number} ${corpActionsRaw['83526858'].current_state.terms[0].type}`,
        paydate: corpActionsRaw['83526858'].current_state.terms[0].pay_date!,
        updateHistory: corpActionsRaw['83526858'].update_history?.map(history => ({
          alert: 'Y',
          email: 'Y',
          date: history.timestamp?.replace(' +0000', ''),
          type: history.version!
        }))
      }
    ];
  }

  getEmailMarkdown() {
    return {
      '83778079_2': `# **Mandatory Event Information Update: Name Change - CONSOL ENERGY INC.**

## **Event Information Update**
**Event Type:** Name Change - Mandatory  
**Announcement:** 83778079  
**Important:** Please do not reply to this email. Contact your GS representative if you have any questions.

Goldman Sachs has determined that the pertinent event information confirmed by our custodial source is complete. Further updates to the event are still possible.

---

## **Event Details**
| **Event ID** | **Security** | **CUSIP** | **ISIN** | **Pay Date** |
|-------------|-------------|----------|----------|------------|
| 83778079 | CONSOL ENERGY INC. CMN | 20854L108 | US20854L1089 | Jan 15, 2025 |

### **Event Summary**
- **Event Status:** Confirmed  
- **Country of Issue:** US  
- **Effective Date:** Jan 15, 2025  
- **Ticker:** CEIX  
- **SEDOL:** BF4L070  

---

## **Account Details**
| **Account** | **Holding Quantity** |
|------------|------------------|
| 065492233-07 | 10 |

---

## **Security Distribution**
| **Entitled Product ID** | **CUSIP** | **Pay Date** | **Gross Rate** |
|----------------|----------|---------|------------|
| 218937100 (CUSIP) | 20854L1089 | Jan 15, 2025 | 1 share per 1 holding |

---

## **Goldman Sachs Commentary**
The name change of **CONSOL ENERGY INC.** will take effect on **January 14, 2025**, with trading under the new name and symbol beginning on **January 15, 2025**.

For additional information, refer to:
🔗 [SEC Document](https://www.sec.gov/.../d901497d8k.htm)

---

## **Disclaimers**
Any summary of terms relating to the above event is provided by Goldman Sachs as a courtesy to you and for your information only. You should not rely on such a summary. Before making a decision, consult the latest event-related information.

For further information, please log in to the Goldman Sachs Asset Servicing Portal.

🔗 **[Goldman Sachs Disclaimer](https://www.gs.com/disclaimer/global_email/)**

---

This message is intended for the addressee only and may contain confidential or privileged information. If you are not the intended recipient, please delete this message and notify us immediately.
`,
      '83778079_3': `# **Mandatory Event Information Update: Name Change - CONSOL ENERGY INC.**

## **Event Information Update**
**Event Type:** Name Change - Mandatory  
**Announcement:** 83778079  
**Important:** Please do not reply to this email. Contact your GS representative if you have any questions.

Goldman Sachs has determined that the pertinent event information confirmed by our custodial source is complete. Further updates to the event are still possible.

---

## **Event Details**
| **Event ID** | **Security** | **CUSIP** | **ISIN** | **Pay Date** |
|-------------|-------------|----------|----------|------------|
| 83778079 | CONSOL ENERGY INC. CMN | 20854L108 | US20854L1089 | Jan 15, 2025 |

### **Event Summary**
- **Event Status:** Confirmed  
- **Country of Issue:** US  
- **Effective Date:** Jan 15, 2025  
- **Ticker:** CEIX  
- **SEDOL:** BF4L070  

---

## **Account Details**
| **Account** | **Holding Quantity** |
|------------|------------------|
| 065492233-07 | 10 |

---

## **Security Distribution**
| **Entitled Product ID** | **CUSIP** | **Pay Date** | **Gross Rate** |
|----------------|----------|---------|------------|
| 218937100 (CUSIP) | 20854L1089 | Jan 15, 2025 | 1 share per 1 holding |

---

## **Goldman Sachs Commentary**
The name change of **CONSOL ENERGY INC.** will take effect on **January 14, 2025**, with trading under the new name and symbol beginning on **January 15, 2025**.

For additional information, refer to:
🔗 [SEC Document](https://www.sec.gov/.../d901497d8k.htm)

---

## **Disclaimers**
Any summary of terms relating to the above event is provided by Goldman Sachs as a courtesy to you and for your information only. You should not rely on such a summary. Before making a decision, consult the latest event-related information.

For further information, please log in to the Goldman Sachs Asset Servicing Portal.

🔗 **[Goldman Sachs Disclaimer](https://www.gs.com/disclaimer/global_email/)**

---

This message is intended for the addressee only and may contain confidential or privileged information. If you are not the intended recipient, please delete this message and notify us immediately.
`,
      '83778079_4': `# **Mandatory Event Information Update: Name Change - CONSOL ENERGY INC.**

## **Event Information Update**
**Event Type:** Name Change - Mandatory  
**Announcement ID:** 83778079  

> **Important:** Please do not reply to this email. Contact your GS representative if you have any questions.

Goldman Sachs has determined that the pertinent event information confirmed by our custodial source is complete. Further updates to the event are still possible.

---

## **Event Details**
| **Event ID** | **Security** | **CUSIP** | **ISIN** | **Pay Date** |
|-------------|-------------|----------|----------|------------|
| 83778079 | CONSOL ENERGY INC. CMN | 20854L108 | US20854L1089 | Jan 15, 2025 |

### **Event Summary**
- **Event Status:** Confirmed  
- **Country of Issue:** US  
- **Effective Date:** Jan 15, 2025  
- **Ticker:** CEIX  
- **SEDOL:** BF4L070  

---

## **Account Details**
| **Account** | **Holding Quantity** |
|------------|------------------|
| 065492233-07 | 10 |

---

## **Security Distribution**
| **Entitled Product ID** | **CUSIP** | **Pay Date** | **Gross Rate** |
|----------------|----------|---------|------------|
| 218937100 (CUSIP) | 20854L1089 | Jan 15, 2025 | 1 share per 1 holding |

---

## **Goldman Sachs Commentary**
The name change of **CONSOL ENERGY INC.** will take effect on **January 14, 2025**, with trading under the new name and symbol beginning on **January 15, 2025**.

For additional information, refer to:  
🔗 [SEC Document](https://www.sec.gov/.../d901497d8k.htm)

---

## **Legal Disclosures & Disclaimers**
Any summary of terms relating to the above event is provided by Goldman Sachs as a courtesy to you and for your information only. You should not rely on such a summary. Before making a decision, consult the latest event-related information.

For further information, please log in to the **Goldman Sachs Asset Servicing Portal**.

🔗 **[Goldman Sachs Disclaimer](https://www.gs.com/disclaimer/global_email/)**

---

This message is intended for the addressee only and may contain confidential or privileged information. If you are not the intended recipient, please delete this message and notify us immediately.
`,
      '83526858_2': `# **ACTION REQUIRED: GS DEADLINE APPROACHING - Response Required**

## **Important Notice**
The deadline for providing your response(s) for the below event(s) is approaching.  
- If you are a **long holder** and do not respond by the stated deadline, the **default option** will be applied.  
- If you are a **short holder**, you **must** respond by the stated deadline if you intend to cover your short position.

⚠ **Please do not reply to this email. Contact your GS representative if you have any questions.**

---

## **Event Details**
### **OVH GROUP SAS CMN**
- **Announcement ID:** 83526858  
- **Event Type:** Tender Offer  
- **CUSIP:** 9EQ75MMG6  
- **ISIN:** FR0014005HJ9  

🔗 **[Submit elections for this event](https://marquee.gs.com/s_prime_asset-servicing_details_83526858)**  

---

## **Account Details**
| **Account** | **Holding Quantity** | **Account Deadline** |
|------------|------------------|------------------|
| 064546831-06 (SDB2838117495) | 1 | Jan 03, 2025 11:00 LD |

---

## **Important Information**
If this is a **voluntary event**, your instructions will be executed on the deadline date unless you explicitly instruct otherwise.

🔗 **[View Asset Servicing Notifications & Submit Instructions](https://marquee.gs.com/s_prime_asset-servicing/)**  

---

## **Legal Disclosures & Disclaimers**
This summary of terms is provided by Goldman Sachs for informational purposes only.  
Do not rely solely on this summary. Before making a decision, consult the latest event-related information and applicable disclaimers.  

For more details, log into the **Goldman Sachs Asset Servicing Portal** or contact your client service team.

🔗 **[Goldman Sachs Disclaimer](https://www.gs.com/disclaimer/global_email/)**  

---

⚠ **Confidentiality Notice:**  
This message is intended for the addressee only and may contain confidential or privileged information.  
If you are not the intended recipient, **please delete this message and notify us immediately.**
`,
      '83526858_3': `# **ACTION REQUIRED: GS DEADLINE APPROACHING - Response Required**

## **Important Notice**
The deadline for providing your response(s) for the event(s) listed below is approaching.  
- If you are a **long holder** and do not respond by the stated deadline, the **default option** will be applied.  
- If you are a **short holder**, you **must** respond by the stated deadline if you intend to cover your short position.

⚠ **Please do not reply to this email. Contact your GS representative if you have any questions.**

---

## **Event Details**
### **OVH GROUP SAS CMN**
- **Announcement ID:** 83526858  
- **Event Type:** Tender Offer  
- **CUSIP:** 9EQ75MMG6  
- **ISIN:** FR0014005HJ9  

🔗 **[Submit elections for this event](https://marquee.gs.com/s_prime_asset-servicing_details_83526858)**  

---

## **Account Details**
| **Account** | **Holding Quantity** | **Account Deadline** |
|------------|------------------|------------------|
| 064546831-06 (SDB2838117495) | 1 | Jan 03, 2025 11:00 LD |

---

## **Important Information**
If this is a **voluntary event**, your instructions will be executed on the deadline date unless you explicitly instruct otherwise.

🔗 **[View Asset Servicing Notifications & Submit Instructions](https://marquee.gs.com/s_prime_asset-servicing/)**  

---

## **Legal Disclosures & Disclaimers**
This summary of terms is provided by Goldman Sachs as a courtesy to you and for informational purposes only.  
Do not rely solely on this summary. Before making a decision, consult the latest event-related information and applicable disclaimers.  

For more details, log into the **Goldman Sachs Asset Servicing Portal** or contact your client service team.

🔗 **[Goldman Sachs Disclaimer](https://www.gs.com/disclaimer/global_email/)**  

---

⚠ **Confidentiality Notice:**  
This message is intended for the addressee only and may contain confidential or privileged information.  
If you are not the intended recipient, **please delete this message and notify us immediately.**
`,
      '83526858_4': ``,
      '83526858_5': ``

    };
    
  }
}

export const corpActionsDataService = new CorporateActionsDataService();