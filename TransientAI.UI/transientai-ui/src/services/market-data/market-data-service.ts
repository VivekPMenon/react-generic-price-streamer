import {webApihandler} from "../web-api-handler";
import {FinancialData, GraphDataPoint, ImageType, Instrument, MarketData, PeriodType, Price, TraceData} from "./model";
import {isToday, parseIsoDate,} from "@/lib/utility-functions/date-operations";
import {MarketDataType} from "@/services/macro-panel-data/model";

class MarketDataService {
  readonly serviceName = 'hurricane-api';

  async getMarketDataGraph(timeRange: string, bondNames: string): Promise<GraphDataPoint[]> {
    const result = await webApihandler.get('market/market_graph', {
      bond_names: bondNames,
      sources: 'Bloomberg HP',
      time_range: timeRange
    });

    return result.data[bondNames!];
  }

  async getMarketDataPrices(isin?: string): Promise<Price[]> {
    const result = await webApihandler.post('market/market_data', { isin }, {});
    return result.market_data;
  }

  async getTraces(isin?: string): Promise<TraceData[]> {
    const result = await webApihandler.post('trace/trace_data', { isin }, { page: 1 });
    return result.trace_data;
  }

  async getMarketData(company_or_ticker: string, period: PeriodType = PeriodType.ONE_YEAR, type?: MarketDataType, abortSignal?: AbortSignal): Promise<Instrument|null> {
    try {
      const params: Record<string, unknown> = {
        company_or_ticker,
        type: (type === undefined || type === MarketDataType.UNKNOWN) ? MarketDataType.EQUITY : type,
        period,
        intraday: false,
        interval: 5
      };
      return await this.getMarketDataCore(params, abortSignal);

    } catch (e) {
      return null;
    }
  }

  async getIntradayData(company_or_ticker: string, period: PeriodType = PeriodType.ONE_DAY, type?: MarketDataType, abortSignal?: AbortSignal): Promise<Instrument|null> {
    try {
      const params: Record<string, unknown> = {
        company_or_ticker,
        type: (type === undefined || type === MarketDataType.UNKNOWN) ? MarketDataType.EQUITY : type,
        period: period,
        intraday: true,
        interval: 5
      };

      return await this.getMarketDataCore(params, abortSignal);
    } catch (e: any) {
      return null;
    }
  }

  async getFinancialData(company_or_ticker : string, period: PeriodType = PeriodType.ONE_YEAR): Promise<FinancialData|null> {
   try {
     const financials = await webApihandler
         .get(
             `financials/${company_or_ticker}`, {
               period
             }, {
               serviceName: this.serviceName
             });

     if (financials.latest_quarter_date) {
       financials.latest_quarter = new Date(financials.latest_quarter_date).toLocaleDateString('en-US', {
         month: 'short',
         year: 'numeric'
       });
     }

     return financials;
   } catch (e: any) {
     return null;
   }
  }

  async getLogo(company_or_ticker: string, format: ImageType = ImageType.SVG, size: number = 100): Promise<any> {
    return await webApihandler
        .get(
            `logo/${company_or_ticker}`, {
              format,
              size
            }, {
              serviceName: this.serviceName
            });
  }

  getLogoUrl(company_or_ticker: string, format: ImageType = ImageType.SVG, size: number = 100): string {
    return webApihandler.getUrl(`logo/${company_or_ticker}`, {
      serviceName: this.serviceName
    }, {
      format,
      size
    });
  }

  private async getMarketDataCore(params: Record<string, unknown>, abortSignal?: AbortSignal) {
    const result = await webApihandler
        .get(
            'market-data', params, {
              serviceName: this.serviceName,
              signal: abortSignal
            });

    const marketData = result.data;
    let previousClose: number|undefined = undefined;
    let latest: MarketData|undefined = undefined;
    if (marketData && marketData.length) {
      marketData.forEach((market: any) => {
        market.date = new Date(market.date);
        market.timestamp = market.timestamp
            ? new Date(market.timestamp)
            : market.date;
      });

      latest = marketData[marketData.length - 1];
      if (isToday(latest?.date) && marketData[marketData.length - 2]) {
        previousClose = marketData[marketData.length - 2]?.close;
      } else {
        previousClose = latest?.close;
      }
    }

    return {
      ticker: result.ticker,
      company_name: result.company_name,
      marketData: marketData,
      lastMarketData: latest,
      current_price: result.current_price,
      previous_close: previousClose,
      change: result.change,
      percent_change: result.percent_change,
      timestamp: parseIsoDate(result.timestamp) || new Date(),
      dispose: null
    };
  }
}

export const marketDataService = new MarketDataService();