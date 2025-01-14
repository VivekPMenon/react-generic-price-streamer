import { webApihandler } from "../web-api-handler";
import { BondInfo } from "./model";

class ProductBrowserDataService {

  async getTodaysAxes(): Promise<BondInfo[]> {
    const result = await webApihandler.post('inventory/get_product_browser_data', {}, {
      page: 1,
      page_size: 500
    });
    return result.bonds_data;
  }
}

export const productBrowserDataService = new ProductBrowserDataService();