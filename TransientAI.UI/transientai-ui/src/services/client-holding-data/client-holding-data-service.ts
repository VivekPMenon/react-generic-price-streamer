
import { webApihandler } from "../web-api-handler";
import { ClientHolding } from "./model";

class ClientHoldingDataService {

  async getClientHoldings(): Promise<ClientHolding[]> {
    const result = await webApihandler.post('client_holding/client_holdings', {}, {
      page: 1,
      page_size: 5000
    });
    return result.client_holding_data;
  }
}

export const clientHoldingsDataService = new ClientHoldingDataService();