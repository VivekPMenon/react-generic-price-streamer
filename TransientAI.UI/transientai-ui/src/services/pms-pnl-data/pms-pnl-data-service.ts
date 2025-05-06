import {webApihandler} from "../web-api-handler";
import {Report, ReportItem} from "@/services/pms-pnl-data/model";

class PmsPnlDataService {
  private readonly serviceName = 'hurricane-api';

  async getReport(): Promise<Report|null> {
    try {
      const result = await webApihandler.get('performance-dashboard', {}, {
        serviceName: this.serviceName
      });

      result.data = result.data.filter((item: ReportItem) => item.manager !== 'Total');

      return result;
    } catch(e: any) {
      console.error(e);
      return null;
    }
  }
}

export const pmsPnlPanelDataService = new PmsPnlDataService();
