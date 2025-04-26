import { webApihandler } from "../web-api-handler";
import {
  BondInfo,
  ClientTrade,
  NewsArticle,
  RecommendedBond,
  RecommendedBondInHolding,
  RecommendedClient
} from "./model";
import {TraceData} from "@/services/market-data";
import {removeDuplicates} from "@/lib/utility-functions/array-operations";

class ProductBrowserDataService {
  private serviceName = 'sell-side-api';

  async getTodaysAxes(): Promise<BondInfo[]> {
    try {
      return await webApihandler.get('inventory', {
        page: 1, page_size: 500,
      }, {
        serviceName: this.serviceName
      });
    } catch (e: any) {
      return [];
    }
  }

  async getTraces(isin?: string): Promise<TraceData[]> {
    try {
      const result = await webApihandler.post(
          'trace_data',
          undefined,
          {page: 1, isin, limit: 50}, {
            serviceName: this.serviceName
          });
      return result.trace_data;
    } catch (e: any) {
      return [];
    }
  }

  async getRecommendationExplanation(bond: BondInfo, clientName: string): Promise<string> {
    try {
      const data: { [key: string]: any } = bond.isin ? {
        bond_isin: bond.isin
      } : {
        bond_description: bond.product_description
      };
      data['client_name'] = clientName;
      data['recommendation_type'] = 'model_based';
      data['score'] = null;
      const result = await webApihandler.post(
          'generate-recommendation-explanation',
          undefined, data,
          {
            serviceName: this.serviceName
          });

      return result.description;
    } catch (e: any) {
      return '';
    }
  }

  async getRecommendedClients(bond: BondInfo): Promise<RecommendedClient[]> {
    try {
      const data: { [key: string]: any } = bond.isin ? {
        isin: bond.isin
      } : {
        description: bond.product_description
      };
      data['top_n'] = 10;
      const result = await webApihandler.post(
          'recommend-clients-for-bond',
          undefined, data,
          {
            serviceName: this.serviceName
          });

      return (result.recommendations as RecommendedClient[])
          .sort((a: RecommendedClient, b: RecommendedClient) => b.score - a.score);
    }  catch (e: any) {
      return [];
    }
  }

  async getRecommendedBondsForClient(client_name: string): Promise<RecommendedBond[]> {
    try {
      const data = {
        client_name: client_name.toUpperCase(),
        top_n: 5,
        method: 'profile'
      };
      const result = await webApihandler.post(
          'recommend-bonds-for-client',
          undefined, data,
          {
            serviceName: this.serviceName
          });

      return removeDuplicates<RecommendedBond>(result.recommendations, 'isin')
          .sort((a: RecommendedBond, b: RecommendedBond) => b.score - a.score);
    } catch (e: any) {
      return [];
    }
  }

  async getRecommendedClientsWithBonds(bond: BondInfo): Promise<RecommendedClient[]> {
    try {
      const data: { [key: string]: any } = bond.isin ? {
        isin: bond.isin
      } : {
        description: bond.product_description
      };
      data['top_n'] = 5;
      const result = await webApihandler.post('recommend-clients-with-similar-bonds', {}, data, {
        serviceName: this.serviceName
      });

      return (result.recommendations as RecommendedClient[])
          .sort((a: RecommendedClient, b: RecommendedClient) => b.score - a.score);
    } catch (e: any) {
      return [];
    }
  }

  async getSimilarBondsInHoldings(bond: BondInfo, client_name?: string|null): Promise<RecommendedBondInHolding[]> {
    try {
      const data: { [key: string]: any } = bond.isin ? {
        bond_isin: bond.isin
      } : {
        bond_description: bond.product_description
      };
      if (client_name) {
        data['client_name'] = client_name;
      }
      data['top_n'] = 5;
      const result = await webApihandler.post('recommend-similar-bonds-in-holdings', {}, data, {
        serviceName: this.serviceName
      });
      return result.recommendations;
    } catch (e: any) {
      return [];
    }
  }

  async getTradesByBond(bond: BondInfo): Promise<ClientTrade[]> {
    try {
      const result = await webApihandler.get('trades-by-bond', {
        product_id: bond.product_id,
      }, {
        serviceName: this.serviceName
      });

      result.forEach((clientTrade: ClientTrade) => {
        clientTrade.date = new Date(clientTrade.date);
      });

      return result;
    } catch (e: any) {
      return [];
    }
  }

  async getClientTradesByBond(bond: BondInfo, client_name: string): Promise<ClientTrade[]> {
    try {
      return await webApihandler.get('client-trades-by-bond', {
        client_name,
        product_id: bond.product_id,
      }, {
        serviceName: this.serviceName
      });
    } catch (e: any) {
      return [];
    }
  }

  async getNews(bond: BondInfo|null): Promise<NewsArticle[]> {
    if (!bond) {
      return [];
    }
    try {
      const issuer_ticker = bond.issuer_ticker;
      const result = await webApihandler.get(`issuer-news/${issuer_ticker}`, {
        days: 7
      }, {
        serviceName: this.serviceName
      });
      result.articles.forEach((article: NewsArticle) => {
        article.date = new Date(article.date);
      })
      return result.articles.sort((a: NewsArticle, b: NewsArticle) => b.date.getTime() - a.date.getTime());
    } catch (e: any) {
      return [];
    }
  }

  async getBreakingNews(): Promise<NewsArticle[]> {
    try {
      const result = await webApihandler.get(`breaking-news`, {
        limit: 20
      }, {
        serviceName: this.serviceName
      });
      result.articles.forEach((article: NewsArticle) => {
        article.date = new Date(article.date);
      })
      return result.articles.sort((a: NewsArticle, b: NewsArticle) => b.date.getTime() - a.date.getTime());
    } catch (e: any) {
      return [];
    }
  }
}

export const productBrowserDataService = new ProductBrowserDataService();