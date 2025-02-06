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
    return `
    # **ACTION REQUIRED: GS DEADLINE APPROACHING - Response Required**

## Important Notice
The deadline for providing your response(s) for the below event(s) is approaching. If you are a long holder and do not respond by the stated deadline, the default option will be applied. If you are a short holder, you must respond by the stated deadline if you intend to cover your short position.

**Please do not reply to this email. Contact your GS representative if you have any questions.**

---

## **Event Details**
**OVH GROUP SAS CMN**  
- **Announcement:** 83526858 - Tender Offer  
- **CUSIP:** 9EQ75MMG6  
- **ISIN:** FR0014005HJ9  

🔗 **[Submit elections for this event](https://urldefense.proofpoint.com/v2/url?u=https-3A__marquee.gs.com_s_prime_asset-2Dservicing_details_83526858&d=DwMCAQ&c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&r=A7tlQCIIJB9Ob8nJm_1Ajck1naXri-21b3rxyqo2ldJ8&m=TP96IaejJ7JePgel3FLBDCecHxj6OJRJQ85usjlUgc60vvomaYtVtXSXLaXYCBRs0&s=gaGaS94z_fqBwdf7aMK7mOLeeDNGy_UVQSbDxTpiF0w&e=)**

---

### **Account Details**
| **Account** | **Holding Quantity** | **Account Deadline** |
|------------|------------------|------------------|
| 064546831-06 (SDB2838117495) | 1 | Jan 03, 2025 11:00 LD |

---

### **Important Disclaimer**
If this is a **voluntary** event, please note that your instructions will be executed on the deadline date unless you explicitly instruct otherwise.  

🔗 **[View Asset Servicing Notifications and Submit Instructions](https://urldefense.proofpoint.com/v2/url?u=https-3A__marquee.gs.com_s_prime_asset-2Dservicing_&d=DwMCAQ&c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&r=A7tlQCIIJB9Ob8nJm_1Ajck1naXri-21b3rxyqo2ldJ8&m=TP96IaejJ7JePgel3FLBDCecHxj6OJRJQ85usjlUgc60vvomaYtVtXSXLaXYCBRs0&s=ojVv94SZ4BXlD4ImjlXVW3aAagYzF1AldkmHl4polf0&e=)**

---

### **Legal Disclosures & Disclaimers**
Any summary of terms relating to the above event contained in this notification is provided by Goldman Sachs as a courtesy to you and for your information only. You should not rely on such summary. Before making a decision to act, you should consult the latest version of the event-related information, together with any applicable disclaimers associated with your account, position, or event. You can obtain such information by logging into the Goldman Sachs Asset Servicing Portal or by contacting your client service team.

**The Goldman Sachs Group, Inc. All rights reserved.**  
🔗 **[Important Risk Disclosures](https://www.gs.com/disclaimer/global_email/)**

---

This message is intended for the addressee only and may contain confidential or privileged information. If you are not the intended recipient, please delete this message and notify us immediately.

    `;
  }
}

export const corpActionsDataService = new CorporateActionsDataService();