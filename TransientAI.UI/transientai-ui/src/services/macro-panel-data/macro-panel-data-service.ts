import { webApihandler } from "../web-api-handler";
import {BloombergEmailReport, FxRate, TreasuryYield} from './model';

class MacroPanelDataService {
  readonly serviceName = 'hurricane-api';
  readonly wordMap: {[key: string]: number} = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
    'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
    'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13,
    'fourteen': 14, 'fifteen': 15, 'sixteen': 16,
    'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000, 'million': 1000000,
    'billion': 1000000000
  };

  async getBloombergReportEmails(): Promise<BloombergEmailReport[]> {
    const result = await webApihandler.get('latest-bloomberg-report', {}, {
      serviceName: this.serviceName
    });
    return result.reports;
  }

  async getTreasuryYields(): Promise<TreasuryYield[]> {
    try {
      const result = await webApihandler.get('treasury-yields', {}, {
        serviceName: this.serviceName
      });
      return Object.entries(result)
          .filter(([key]) => key !== 'as_of_date')
          .map(([name, item]) => ({
                name: this.formatName(name),
                ...(item as object)
              } as TreasuryYield));
    } catch (e: any) {
      return [];
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

  map(word: string): number|string {
    word = word.toLowerCase();
    return this.wordMap[word] || word;
  }

  properCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  formatName(name: string): string {
    const parts = name.split('_');
    let nameToUse: string;
    switch (parts.length) {
      case 0:
        nameToUse = '';
        break;
      case 1:
        nameToUse = name.toUpperCase();
        break;
      case 2:
        nameToUse = `${this.map(parts[0])} ${this.formatSuffix(parts[1])}`;
        break;
      default:
        const mapped = parts.map(part => this.map(part));
        const prefix = mapped.slice(0, parts.length - 1).join('-');
        nameToUse = `${prefix} ${this.formatSuffix(parts[parts.length - 1])}`;
        break;
    }
    return nameToUse;
  }

  formatSuffix(word: string): string {
    return this.properCase(word.replace(/[aeiou]/gi, ''));
  }
}

export const macroPanelDataService = new MacroPanelDataService();
