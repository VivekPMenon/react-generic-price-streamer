import {webApihandler} from "../web-api-handler";
import {FinancialData, GraphDataPoint, ImageType, Instrument, MarketData, PeriodType, Price, TraceData} from "./model";

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

  async getMarketData(company_or_ticker : string, period: PeriodType = PeriodType.ONE_YEAR): Promise<Instrument|null> {
    try {
      const result = await webApihandler
          .get(
              `market-data/${company_or_ticker}`, {
                period
              }, {
                serviceName: this.serviceName
              });

      const marketData = result.data;
      const latest: MarketData|undefined = marketData && marketData.length
          ? marketData[marketData.length - 1]
          : undefined;

      return {
        ticker: result.ticker,
        company_name: result.company_name,
        marketData: marketData,
        lastMarketData: latest,
        current_price: result.current_price,
        change: result.change,
        percent_change: result.percent_change,
        timestamp: new Date(result.timestamp)
      };
    } catch (e) {
      return null;
    }
  }

  async getFinancialData(company_or_ticker : string, period: PeriodType = PeriodType.ONE_YEAR): Promise<FinancialData> {
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
}

export const marketDataService = new MarketDataService();