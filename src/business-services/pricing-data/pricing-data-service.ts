import { webApihandler } from "../../common-services/web-api-handler";
import instrumentsJson from './instruments.json'
import { SecurityData } from "./model";

class PricingDataService {
  async getSecuritiesWithPrices() {
    return await webApihandler.get('https://www.ag-grid.com/example-assets/row-data.json');
  }

  async getSecurities(): Promise<SecurityData[]> {
    return instrumentsJson;
  }
}

export const pricingDataService = new PricingDataService();