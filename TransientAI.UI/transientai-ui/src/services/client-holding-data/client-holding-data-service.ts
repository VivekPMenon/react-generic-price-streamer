
import { webApihandler } from "../web-api-handler";
import { BondTrade, ClientHolding } from "./model";

class ClientHoldingDataService {

  async getClientHoldings(isin?: string): Promise<ClientHolding[]> {
    const result = await webApihandler.post('client_holding/client_holdings', { isin }, {
      page: 1,
      page_size: 5000
    });
    return result.client_holding_data;
  }

  async getTradingActivity(security?: string): Promise<BondTrade[]> {
    const result = await webApihandler.post('client_activity/get_client_activity_data', { security }, {
      live_or_historical: 'historical'
    });
    return result.activity_data;
  }
}

export const clientHoldingsDataService = new ClientHoldingDataService();