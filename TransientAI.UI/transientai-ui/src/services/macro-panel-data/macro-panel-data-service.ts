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
import {PeriodType} from "@/services/market-data";
import {parseIsoDate} from "@/lib/utility-functions/date-operations";

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
            if (t.intraday_data?.length) {
              t.intraday_data.forEach(value => {
                value.date = new Date(value.date!);
                if (!value.timestamp) {
                  value.timestamp = value.date;
                }
              });
            }
            return {
              ...t,
              value: t.rate,
              change: t.one_day_change_bps,
              percent: t.ytd_change_bps,
              symbol: t.ticker ?? '',
              marketData: t.intraday_data,
              type: t.type ?? MarketDataType.UNKNOWN
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
              type: t.type ?? MarketDataType.UNKNOWN
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
        if (t.data?.length) {
          t.data.forEach(value => {
            value.date = new Date(value.date!);
            if (!value.timestamp) {
              value.timestamp = value.date;
            }
          });
        }
        return {
          ...t,
          value: t.current_price,
          percent: t.percent_change,
          marketData: t.data,
          type: MarketDataType.FX
        };
      });
    } catch (e: any) {
      return [];
    }
  }

  async getCryptos(): Promise<CryptoCurrency[]> {
    try {
      const result = await webApihandler.get('crypto', {
        period: PeriodType.ONE_DAY,
        intraday: true,
        interval: 5
      }, {
        serviceName: this.serviceName
      });
      return Object.values(result).map(value => {
        const t = value as CryptoCurrency;
        if (t.data?.length) {
          t.data.forEach(value => {
            value.date = new Date(value.date!);
            if (!value.timestamp) {
              value.timestamp = value.date;
            }
          });
        }
        return {
          ...t,
          group_name: 'Coins',
          value: t.current_price,
          percent: t.percent_change,
          marketData: t.data,
          type: MarketDataType.CRYPTOCURRENCY
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
          .flatMap(([key, item]) => (item as object[]).map((i: {[key: string]: any}) => {
            const t = i as EquityFuture;
            if (t.data?.length) {
              t.data.forEach(value => {
                value.date = new Date(value.date!);
                if (!value.timestamp) {
                  value.timestamp = value.date;
                }
              });
            }

            return {
              ...t,
              group_name: key,
              value: t.current_price,
              change: t.change,
              percent: t.percent_change,
              marketData: t.data,
              type: MarketDataType.FUTURES,
              timestamp: parseIsoDate(i['timestamp'] as string) ?? new Date()
            }
          }));
    } catch (e: any) {
      return [];
    }
  }
}

export const macroPanelDataService = new MacroPanelDataService();
