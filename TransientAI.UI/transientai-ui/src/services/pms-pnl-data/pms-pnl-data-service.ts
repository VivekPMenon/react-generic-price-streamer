import {webApihandler} from "../web-api-handler";
import {Report, ReportItem} from "@/services/pms-pnl-data/model";

class PmsPnlDataService {
  private readonly serviceName = 'hurricane-api';

  async getReport(): Promise<[Report, ReportItem|null]|null> {
    try {
      const result = await webApihandler.get('performance-dashboard', {}, {
        serviceName: this.serviceName
      });

      const data = result.data;
      const index = data.findIndex((item: ReportItem) => item.manager === 'Total');
      let total: ReportItem|null = null;
      if (index > -1) {
          total = data[index];
          data.splice(index, 1);
      }
      return [result, total];
    } catch(e: any) {
      console.error(e);
      return null;
    }
  }
}

export const pmsPnlPanelDataService = new PmsPnlDataService();
