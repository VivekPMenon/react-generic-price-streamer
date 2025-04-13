import { webApihandler } from "../web-api-handler";
import { BondInfo, TopRecommendation } from "./model";

class ProductBrowserDataService {
  private serviceName = 'sell-side-api';

  async getTodaysAxes(): Promise<BondInfo[]> {
    return await webApihandler.get('inventory', {
      page: 1,
      page_size: 500
    }, {
      serviceName: this.serviceName
    });
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