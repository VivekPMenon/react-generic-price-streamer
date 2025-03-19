import { webApihandler } from "../web-api-handler";
import { BloombergEmailReport, TreasuryYield } from './model';

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

      return Object.entries(result).map(([name, item]) => ({
        name, ...(item as object)
      } as TreasuryYield));

    } catch (e: any) {
      return [];
    }
  }
}

export const macroPanelDataService = new MacroPanelDataService();
