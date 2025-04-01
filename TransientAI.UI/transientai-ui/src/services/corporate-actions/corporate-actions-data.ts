import { CorporateAction, CorporateActionFilterOptions } from "./model";
import { webApihandler } from "@/services/web-api-handler";
import { endpointFinder } from "../web-api-handler/endpoint-finder-service";

class CorporateActionsDataService {
  private serviceName = 'corp-actions-api';
  private headers = endpointFinder.getCurrentEnvInfo().corpActionApiHeaders;

  async getCorpActionEmail(eventId: string, version: number): Promise<string> {
    try {
      const result = await webApihandler.get(
        `emails/${eventId}/versions/${version}/html`,
        {},
        {
          serviceName: this.serviceName,
          headers: this.headers
        });
      return result.htmlContent;
    } catch (e) {
      return '';
    }
  }

  async getCorpActions(filterOptions?: CorporateActionFilterOptions): Promise<CorporateAction[]> {
    try {
      const result = await webApihandler.get(
        'events',
        filterOptions as { [key: string]: any },
        {
          serviceName: this.serviceName,
          headers: this.headers
        });
      return result.data.filter((corpAction: CorporateAction) => corpAction.isin || corpAction.ticker);
    } catch (e) {
      return [];
    }
  }

  async getPmCorpActions(filterOptions?: CorporateActionFilterOptions): Promise<{ [key: string]: CorporateAction[] }> {
    try {
      const result = await webApihandler.get(
        'corp_actions/portfolio-events',
        filterOptions as { [key: string]: any },
        {
          serviceName: 'hurricane-api-2-0',//this.serviceName,
          headers: this.headers
        });
      
      // Apply filter to each section separately while keeping them distinct
      const filteredResults: { [key: string]: CorporateAction[] } = {};
      
      // Process each section separately
      if (result.data['Action Required']) {
        filteredResults['Action Required'] = result.data['Action Required'].filter(
          (corpAction: CorporateAction) => corpAction.isin || corpAction.ticker
        );
      }
      
      if (result.data['No Action Required']) {
        filteredResults['No Action Required'] = result.data['No Action Required'].filter(
          (corpAction: CorporateAction) => corpAction.isin || corpAction.ticker
        );
      }
      
      if (result.data['Expired']) {
        filteredResults['Expired'] = result.data['Expired'].filter(
          (corpAction: CorporateAction) => corpAction.isin || corpAction.ticker
        );
      }
      
      return filteredResults;
    } catch (e) {
      return {};
    }
  }

  async getCorpActionDetail(eventId: string): Promise<CorporateAction> {
    return await webApihandler.get(
      `events/${eventId}`,
      {},
      {
        serviceName: this.serviceName,
        headers: this.headers
      });
  }

  async searchCorpAction(query: string): Promise<string[]> {
    const result = await webApihandler.get(
        `corpaction-search`, {
          query
        }, {
          serviceName: 'hurricane-api'
        });
    return result.event_ids ?? [];
  }

  // async getCorpActions(): Promise<CorporateAction[]> {
  //   return [
  //     {
  //       eventId: '83778079',
  //       eventType: `${corpActionsRaw['83778079'].current_state.event_type}`,
  //       isin: corpActionsRaw['83778079'].current_state.security.identifiers.isin,
  //       ticker: corpActionsRaw['83778079'].current_state.security.identifiers.ticker,
  //       security: corpActionsRaw['83778079'].current_state.security.name,
  //       eventStatus: corpActionsRaw['83778079'].current_state.event_status,
  //       // eventDate: corpActionsRaw['83778079'].current_state.dates?.notification_date,
  //       // accountId: corpActionsRaw['83778079'].current_state.accounts[0].account_number,
  //       holdingQuantity: Number(corpActionsRaw['83778079'].current_state.accounts[0].holding_quantity),
  //       // entitledProductId: corpActionsRaw['83778079'].current_state.terms[0].security_details.product_id!,
  //       action: `Mandatory Event Information
  //       Update: ${corpActionsRaw['83778079'].current_state.event_type}: ${corpActionsRaw['83778079'].current_state.security.name},
  //       ISIN: ${corpActionsRaw['83778079'].current_state.security.identifiers.isin}`,
  //       // termDetails: `${corpActionsRaw['83778079'].current_state.terms[0].term_number} ${corpActionsRaw['83778079'].current_state.terms[0].type}`,
  //       // paydate: corpActionsRaw['83778079'].current_state.terms[0].pay_date!,
  //       // latestVersion: corpActionsRaw['83778079'].update_history?.reduce((max, history) => Math.max(max, history.version), 0),
  //       // updateHistory: corpActionsRaw['83778079'].update_history?.map(history => ({
  //       //   alert: 'Y',
  //       //   email: 'Y',
  //       //   date: history.timestamp?.replace(' +0000', ''),
  //       //   type: history.version!
  //       // }))
  //     },
  //     {
  //       eventId: '83526858',
  //       eventType: `${corpActionsRaw['83526858'].current_state.event_type}`,
  //       isin: corpActionsRaw['83526858'].current_state.security.identifiers.isin,
  //       ticker: corpActionsRaw['83526858'].current_state.security.identifiers.ticker,
  //       security: corpActionsRaw['83526858'].current_state.security.name,
  //       // eventDate: corpActionsRaw['83778079'].current_state.dates?.notification_date,
  //       eventStatus: corpActionsRaw['83526858'].current_state.event_status,
  //       // accountId: corpActionsRaw['83526858'].current_state.accounts[0].account_number,
  //       holdingQuantity: Number(corpActionsRaw['83526858'].current_state.accounts[0].holding_quantity),
  //       // entitledProductId: corpActionsRaw['83526858'].current_state.terms[0].security_details.product_id!,
  //       action: `Mandatory Event Information
  //       Update: ${corpActionsRaw['83526858'].current_state.event_type}: ${corpActionsRaw['83526858'].current_state.security.name},
  //       ISIN: ${corpActionsRaw['83526858'].current_state.security.identifiers.isin}`,
  //       // termDetails: `${corpActionsRaw['83526858'].current_state.terms[0].term_number} ${corpActionsRaw['83526858'].current_state.terms[0].type}`,
  //       // paydate: corpActionsRaw['83526858'].current_state.terms[0].pay_date!,
  //       // latestVersion: corpActionsRaw['83526858'].update_history?.reduce((max, history) => Math.max(max, history.version), 0),
  //       // updateHistory: corpActionsRaw['83526858'].update_history?.map(history => ({
  //       //   alert: 'Y',
  //       //   email: 'Y',
  //       //   date: history.timestamp?.replace(' +0000', ''),
  //       //   type: history.version!
  //       // }))
  //     }
  //   ];
  // }

  async getEmailSource() {
    return {
      '83778079_2': `../emails/ConsoleEnergy.html`,
      '83778079_3': `../emails/ConsoleEnergy.html`,
      '83778079_4': `../emails/ConsoleEnergy.html`,
      '83526858_2': `../emails/GSDeadline.html`,
      '83526858_3': `../emails/GSDeadline.html`,
      '83526858_4': `../emails/GSDeadline.html`,
      '83526858_5': `../emails/GSDeadline.html`
    };
  }
}

export const corpActionsDataService = new CorporateActionsDataService();