import {webApihandler} from "../web-api-handler";
import {Report, ReportItem} from "@/services/pms-pnl-data/model";

class PmsPnlDataService {
  private readonly serviceName = 'hurricane-api';

  async getReport(): Promise<[Report, ReportItem]|null> {
    // return new Promise((resolve) => {
    //   const result: ReportItem[] = [];
    //
    //   const total: ReportItem = {
    //     manager: 'Total',
    //     dayPnl: 0,
    //     mtdPnl: 0,
    //     ytdPnl: 0,
    //     dayPnlNoFees: 0,
    //     mtdPnlNoFees: 0,
    //     ytdPnlNoFees: 0
    //   }
    //   for (let i = 0; i < 1000; i++) {
    //     result.push({
    //       manager: 'John Doe' + (i+1),
    //       dayPnl: 100000 * (i+1),
    //       mtdPnl: 100001 * (i+1),
    //       ytdPnl: 100002 * (i+1),
    //       dayPnlNoFees: 100003 * (i+1),
    //       mtdPnlNoFees: 100004 * (i+1),
    //       ytdPnlNoFees: 100005 * (i+1)
    //     })
    //
    //     total.dayPnl += result[i].dayPnl;
    //     total.mtdPnl += result[i].mtdPnl;
    //     total.ytdPnl += result[i].ytdPnl;
    //     total.dayPnlNoFees += result[i].dayPnlNoFees;
    //     total.mtdPnlNoFees += result[i].mtdPnlNoFees;
    //     total.ytdPnlNoFees += result[i].ytdPnlNoFees;
    //   }
    //   setTimeout(() => resolve([{
    //     data: result,
    //     filename: 'test.xls',
    //     last_updated: '2025-04-03T13:42:35Z',
    //   }, total]), 5000);
    // });
    try {
      const result = await webApihandler.get('performance-dashboard', {}, {
        serviceName: this.serviceName
      });

      const total: ReportItem = {
        manager: 'Total',
        dayPnl: 0,
        mtdPnl: 0,
        ytdPnl: 0,
        dayPnlNoFees: 0,
        mtdPnlNoFees: 0,
        ytdPnlNoFees: 0
      };
      const data = result.data;
      for (let i = 0; i < data.length; i++) {
          total.dayPnl += data[i].dayPnl;
          total.mtdPnl += data[i].mtdPnl;
          total.ytdPnl += data[i].ytdPnl;
          total.dayPnlNoFees += data[i].dayPnlNoFees;
          total.mtdPnlNoFees += data[i].mtdPnlNoFees;
          total.ytdPnlNoFees += data[i].ytdPnlNoFees;
      }
      return [result, total];
    } catch(e: any) {
      console.error(e);
      return null;
    }
  }
}

export const pmsPnlPanelDataService = new PmsPnlDataService();
