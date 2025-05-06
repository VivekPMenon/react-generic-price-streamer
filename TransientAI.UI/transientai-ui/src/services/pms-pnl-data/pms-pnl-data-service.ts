import {webApihandler} from "../web-api-handler";
import {Report, ReportItem} from "@/services/pms-pnl-data/model";

class PmsPnlDataService {
  private readonly serviceName = 'hurricane-api';
  private readonly getColumnServiceName = 'hurricane-api-2-0';

  async getReport(): Promise<Report|null> {
    try {
      const result = await webApihandler.get('pms/performance-dashboard', {}, {
        serviceName: this.getColumnServiceName
      });

      result.data = result.data.filter((item: ReportItem) => item.manager !== 'Total');

      return result;
    } catch(e: any) {
      console.error(e);
      return null;
    }
  }

  async getColumnDefs(): Promise<any> {
    const query = `
    {
      getAllowedColumns {
        allowedColumns
      }
    }
    `
    const result = await webApihandler.post(
      'graphql',
      {query},
      {},
      {serviceName: this.getColumnServiceName},
    )
    return result;
  }
}

export const pmsPnlPanelDataService = new PmsPnlDataService();
