import { webApihandler } from "../web-api-handler";
import {BloombergEmailReport, BondData, EquityFuture, FxRate, TreasuryYield} from './model';

class MacroPanelDataService {
  private readonly serviceName = 'hurricane-api';

  async getBloombergReportEmails(): Promise<BloombergEmailReport[]> {
    const result = await webApihandler.get('latest-bloomberg-report', {}, {
      serviceName: this.serviceName
    });
    return result.reports;
  }

  async getTreasuryYields(): Promise<[Date|null, TreasuryYield[]]> {
    try {
      const result = await webApihandler.get('treasury-yields', {}, {
        serviceName: this.serviceName
      });
      return [new Date(new Date().setHours(6, 0, 0,0)), Object.entries(result)
          .filter(([key]) => key !== 'as_of_date')
          .map(([, item]) => item as TreasuryYield)];
    } catch (e: any) {
      console.log(e)
      return [null, []];
    }
  }

  async getForeignTreasuryYields(): Promise<[Date|null, TreasuryYield[]]> {
    try {
      const result: BondData[] = await webApihandler.get('foreign-treasury-yields', {}, {
        serviceName: this.serviceName
      });

      return [null, result.flatMap(value => Object.entries(value)
          .filter(([key]) => key === 'bonds')
          .flatMap(([, value]) => Object.values(value)))
      ];
    } catch (e: any) {
      return [null, []];
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

  async getGlobalEquityFutures(): Promise<EquityFuture[]> {
    try {
      const result = await webApihandler.get('global-equity-futures', {}, {
        serviceName: this.serviceName
      });
      return Object.entries(result)
          .flatMap(([key, item]) => (item as object[]).map((i: object) => ({
            group_name: key,
            ...i
          }) as EquityFuture));
    } catch (e: any) {
      return [];
    }
  }
}

export const macroPanelDataService = new MacroPanelDataService();
