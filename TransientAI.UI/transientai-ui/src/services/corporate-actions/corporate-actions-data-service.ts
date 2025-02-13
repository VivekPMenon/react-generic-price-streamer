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

  getEmailSource() {
    return {
      '83778079_2': `emails/ConsoleEnergy.html`,
      '83778079_3': `emails/ConsoleEnergy.html`,
      '83778079_4': `emails/ConsoleEnergy.html`,
      '83526858_2': `emails/GSDeadline.html`,
      '83526858_3': `emails/GSDeadline.html`,
      '83526858_4': `emails/GSDeadline.html`,
      '83526858_5': `emails/GSDeadline.html`

    };
    
  }
}

export const corpActionsDataService = new CorporateActionsDataService();