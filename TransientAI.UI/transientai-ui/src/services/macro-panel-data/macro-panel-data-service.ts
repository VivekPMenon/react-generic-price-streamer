import {webApihandler} from "../web-api-handler";
import {
  BloombergEmailReport,
  BondData,
  CryptoCurrency,
  EquityFuture,
  FxRate,
  MarketDataType,
  TreasuryYield
} from './model';

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

      return [new Date(result.as_of_date), Object.entries(result)
          .filter(([key]) => key !== 'as_of_date')
          .map(([, item]) => {
            const t = item as TreasuryYield;
            return {
              ...t,
              value: t.rate,
              change: t.one_day_change_bps,
              percent: t.ytd_change_bps,
              symbol: t.ticker ?? '',
              type: t.type
            };
          })];
    } catch (e: any) {
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
          .flatMap(([, value]) => Object.values(value).map(v => {
            const t = v as TreasuryYield;
            return {
              ...t,
              value: t.rate,
              change: t.one_day_change_bps,
              percent: t.ytd_change_bps,
              symbol: t.ticker ?? '',
              type: t.type ?? MarketDataType.FOREIGN_TREASURY
            };
          })))
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
      return Object.values(result).map(value => {
        const t = value as FxRate;
        return {
          ...t,
          value: t.price,
          percent: t.change_percentage,
          symbol: t.ticker,
        };
      });
    } catch (e: any) {
      return [];
    }
  }

  async getCryptos(): Promise<CryptoCurrency[]> {
    try {
      const result = await webApihandler.get('crypto', {}, {
        serviceName: this.serviceName
      });
      return Object.values(result).map(value => {
        const t = value as CryptoCurrency;
        return {
          ...t,
          group_name: 'Coins',
          value: t.price,
          percent: t.change_percentage,
          symbol: t.ticker,
        };
      }).sort((a, b) => (b.percent ?? 0.0) - (a.percent ?? 0.0));
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
          .flatMap(([key, item]) => (item as object[]).map((i: object) => {
            const t = i as EquityFuture;
            return {
              ...t,
              group_name: key,
              change: t.net_change,
              percent: t.percent_change,
            }
          }));
    } catch (e: any) {
      return [];
    }
  }
}

export const macroPanelDataService = new MacroPanelDataService();
