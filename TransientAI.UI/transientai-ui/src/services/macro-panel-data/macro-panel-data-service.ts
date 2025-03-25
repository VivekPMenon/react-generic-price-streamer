import { webApihandler } from "../web-api-handler";
import {BloombergEmailReport, BondData, Bond, EquityFuture, FxRate, TreasuryYield} from './model';

class MacroPanelDataService {
  private readonly serviceName = 'hurricane-api';
  private readonly translations = new Map<string, string>([
      ['JAPAN', 'JGBs'],
      ['GERMANY', 'Bunds']
  ]);
  private readonly sortOrder: string[] = [
      '1Y',
      '2Y',
      '5Y',
      '10Y',
      '30Y'
  ];
  private readonly compareFunction = (a: TreasuryYield, b: TreasuryYield) => {
    const aType = a.group_name;
    const bType = b.group_name;
    if (aType === bType) {
      const aMaturity  = a.maturity;
      const bMaturity = b.maturity;
      if (aMaturity === bMaturity) {
        return 0;
      }
      if (aMaturity && bMaturity) {
        const aIndex = this.sortOrder.indexOf(aMaturity);
        const bIndex = this.sortOrder.indexOf(bMaturity);
        return aIndex > bIndex ? 1 : -1;
      }

      if (!aMaturity && !bMaturity) {
        return 0;
      }
      return !aMaturity ? -1 : 1;
    }

    if (aType > bType) {
      return 1;
    }

    if (aType < bType) {
      return -1;
    }

    return 0;
  };


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
      return [null, []];
    }
  }

  async getForeignTreasuryYields(): Promise<[Date|null, TreasuryYield[]]> {
    try {
      const result: BondData[] = await webApihandler.get('foreign-treasury-yields', {}, {
        serviceName: this.serviceName
      });

      return [null, result.flatMap(value => Object.values(value.bonds)
          .flatMap(bond => ({
            name: this.toProperCase(bond.Bond),
            group_name: this.convert(bond.Country),
            rate: bond.Bond_Yield,
            one_day_change_bps: bond.Bond_Yield,
            ytd_change_bps: bond.YTD,
            maturity: bond.Maturity?.toUpperCase() ?? '',
          })))
          .sort(this.compareFunction)
      ];
    } catch (e: any) {
      debugger;
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

  private convert(value: string): string {
    return this.translations.get(value.toUpperCase()) ?? value;
  }

  private toProperCase(value: string|null|undefined): string {
    if (value) {
      if (value.length === 0) {
        return value.toUpperCase();
      }
      return value[0].toUpperCase() + value.slice(1);
    }
    return '';
  }
}

export const macroPanelDataService = new MacroPanelDataService();
