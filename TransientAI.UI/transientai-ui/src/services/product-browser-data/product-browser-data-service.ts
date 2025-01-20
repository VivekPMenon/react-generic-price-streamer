import { webApihandler } from "../web-api-handler";
import { BondInfo, TopRecommendation } from "./model";

class ProductBrowserDataService {

  async getTodaysAxes(): Promise<BondInfo[]> {
    const result = await webApihandler.post('inventory/get_product_browser_data', {}, {
      page: 1,
      page_size: 500
    });
    return result.bonds_data;
  }

  async getTopRecommendations(): Promise<string[]> {
    const result = await webApihandler.get('unsolicited/companies', {});
    return result;
  }

  async getRecommendationsDetails(company: string): Promise<TopRecommendation> {
    const result = await webApihandler.get('unsolicited', { company });
    return result.top_recommendations[0];
  }
}

export const productBrowserDataService = new ProductBrowserDataService();