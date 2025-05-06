import {webApihandler} from "../web-api-handler";
import {Report, ReportItem} from "@/services/pms-pnl-data/model";

class PmsPnlDataService {
  private readonly serviceName = 'hurricane-api';
  private readonly getColumnServiceName = 'hurricane-api-2-0';

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

  async getColumnDefs(): Promise<any> {
    const result = await webApihandler.get(
      '',
      {},
      {serviceName: this.getColumnServiceName},
    )
    return result;
  }
}

export const pmsPnlPanelDataService = new PmsPnlDataService();
