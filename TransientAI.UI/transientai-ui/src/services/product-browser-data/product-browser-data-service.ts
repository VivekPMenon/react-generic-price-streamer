import { webApihandler } from "../web-api-handler";
import {BondInfo, RecommendedClient, TopRecommendation} from "./model";

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

  async getRecommendedClients(bond: BondInfo): Promise<RecommendedClient[]> {
    const result = await webApihandler.post('recommend-clients-for-bond', {
      isin: bond.isin,
      description: bond.product_description,
      top_n: 10
    }, {
      serviceName: this.serviceName
    });

    return result.recommendations;
  }

  async getRecommendedClientsWithBonds(bond: BondInfo): Promise<BondInfo[]> {
    return await webApihandler.post('recommend-clients-with-similar-bonds', {
      isin: bond.isin,
      description: bond.product_description,
      top_n: 10
    }, {
      serviceName: this.serviceName
    });
  }

  async getSimilarBondsInHoldings(bond: BondInfo, client_name: string): Promise<BondInfo[]> {
    return await webApihandler.post('recommend-clients-with-similar-bonds', {
      client_name,
      bond_isin: bond.isin,
      bond_description: bond.product_description,
      top_n: 10
    }, {
      serviceName: this.serviceName
    });
  }

  async getTradesByBond(bond: BondInfo): Promise<BondInfo[]> {
    return await webApihandler.post('trades-by-bond', {
      product_description: bond.product_description,
    }, {
      serviceName: this.serviceName
    });
  }

  async getClientTradesByBond(bond: BondInfo, client_name: string): Promise<BondInfo[]> {
    return await webApihandler.post('client-trades-by-bond', {
      client_name,
      product_description: bond.product_description,
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