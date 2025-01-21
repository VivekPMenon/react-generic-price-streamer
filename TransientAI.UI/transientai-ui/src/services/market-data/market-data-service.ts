import { webApihandler } from "../web-api-handler";
import { GraphDataPoint } from "./model";

class MarketDataService {

  async getMarketData(timeRange: string, bondNames: string): Promise<GraphDataPoint[]> {
    const result = await webApihandler.get('market/market_graph', {
      bond_names: bondNames,
      sources: 'Bloomberg HP',
      time_range: timeRange
    });

    return result.data[bondNames!];
  }
}

export const marketDataService = new MarketDataService();