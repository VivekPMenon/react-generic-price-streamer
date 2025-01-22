import { webApihandler } from "../web-api-handler";
import { GraphDataPoint, Price, TraceData } from "./model";

class MarketDataService {

  async getMarketDataGraph(timeRange: string, bondNames: string): Promise<GraphDataPoint[]> {
    const result = await webApihandler.get('market/market_graph', {
      bond_names: bondNames,
      sources: 'Bloomberg HP',
      time_range: timeRange
    });

    return result.data[bondNames!];
  }

  async getMarketDataPrices(): Promise<Price[]> {
    const result = await webApihandler.post('market/market_data', {}, {});
    return result.market_data;
  }

  async getTraces(): Promise<TraceData[]> {
    const result = await webApihandler.post('trace/trace_data', {}, {page: 1});
    return result.trace_data;
  }
}

export const marketDataService = new MarketDataService();