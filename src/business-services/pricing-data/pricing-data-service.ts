import { webApihandler } from "../../common-services/web-api-handler";
import instrumentsJson from './instruments.json'

class PricingDataService {
  async getSecuritiesWithPrices() {
    return await webApihandler.get('https://www.ag-grid.com/example-assets/row-data.json');
  }

  async getSecurities() {
    return instrumentsJson;
  }
}

export const pricingDataService = new PricingDataService();