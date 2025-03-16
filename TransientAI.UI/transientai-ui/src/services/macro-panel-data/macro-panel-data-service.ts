import { webApihandler } from "../web-api-handler";
import { BloombergEmailReport } from './model';

class MacroPanelDataService {

  async getBloombergReportEmails(): Promise<BloombergEmailReport[]> {
    const result = await webApihandler.get('latest-bloomberg-report', {}, { serviceName: 'hurricane-api' });
    return result.reports;
  }
}

export const macroPanelDataService = new MacroPanelDataService();
