import { webApihandler } from "../web-api-handler";
import {BloombergEmailReport, FxRate, TreasuryYield} from './model';

class MacroPanelDataService {
  readonly serviceName = 'hurricane-api';

  async getBloombergReportEmails(): Promise<BloombergEmailReport[]> {
    const result = await webApihandler.get('latest-bloomberg-report', {}, {
      serviceName: this.serviceName
    });
    return result.reports;
  }

  async getTreasuryYields(): Promise<TreasuryYield[]> {
    try {
      const result = await webApihandler.get('treasury-yields', {}, {
        serviceName: this.serviceName
      });
      return Object.entries(result)
          .filter(([key]) => key !== 'as_of_date')
          .map(([, item]) => item as TreasuryYield);
    } catch (e: any) {
      return [];
    }
  }

  async getFxRates(): Promise<FxRate[]> {
    try {
      const result = await webApihandler.get('FX_data', {}, {
        serviceName: this.serviceName
      });
      return Object.values(result);
    } catch (e: any) {
      return [];
    }
  }

  async getCryptos(): Promise<Crypto[]> {
    try {
      const result = await webApihandler.get('crypto', {}, {
        serviceName: this.serviceName
      });
      return Object.values(result);
    } catch (e: any) {
      return [];
    }
  }
}

export const macroPanelDataService = new MacroPanelDataService();
