import { webApihandler } from "../web-api-handler";
import { BondInfo, TopRecommendation } from "./model";

class ProductBrowserDataService {

  async getTodaysAxes(isin?: string): Promise<BondInfo[]> {
    const result = await webApihandler.post('inventory/get_product_browser_data', { isin }, {
      page: 1,
      page_size: 500
    });
    const data = result.bonds_data;
    const random = Math.floor(Math.random() * data.length);
    data[random].is_golden = true;
    return data;
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