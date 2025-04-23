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
    return await webApihandler.get('inventory', {
      page: 1, page_size: 500,
    }, {
      serviceName: this.serviceName
    });
  }

  async getTraces(isin?: string): Promise<TraceData[]> {
    const result = await webApihandler.post(
        'trace_data',
        undefined,
        { page: 1, isin, limit: 50 }, {
      serviceName: this.serviceName
    });
    return result.trace_data;
  }

  async getRecommendationExplanation(bond: BondInfo, clientName: string): Promise<string> {
    const data: {[key:string] : any} = bond.isin ? {
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
  }

  async getRecommendedClients(bond: BondInfo): Promise<RecommendedClient[]> {
    const data: {[key:string] : any} = bond.isin ? {
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
  }

  async getRecommendedBondsForClient(client_name: string): Promise<RecommendedBond[]> {
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
  }

  async getRecommendedClientsWithBonds(bond: BondInfo): Promise<RecommendedClient[]> {
    const data: {[key:string] : any} = bond.isin ? {
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
  }

  async getSimilarBondsInHoldings(bond: BondInfo, client_name: string): Promise<RecommendedBondInHolding[]> {
    const data: {[key:string] : any} = bond.isin ? {
      client_name,
      bond_isin: bond.isin
    } : {
      client_name,
      bond_description: bond.product_description
    };
    data['top_n'] = 5;
    const result = await webApihandler.post('recommend-similar-bonds-in-holdings', {}, data, {
      serviceName: this.serviceName
    });
    return result.recommendations;
  }

  async getTradesByBond(bond: BondInfo): Promise<ClientTrade[]> {
    const result = await webApihandler.get('trades-by-bond', {
      product_description: bond.product_description,
    }, {
      serviceName: this.serviceName
    });

    result.forEach((clientTrade: ClientTrade) => {
      clientTrade.date = new Date(clientTrade.date);
    });

    return result;
  }

  async getClientTradesByBond(bond: BondInfo, client_name: string): Promise<ClientTrade[]> {
    return await webApihandler.get('client-trades-by-bond', {
      client_name,
      product_description: bond.product_description,
    }, {
      serviceName: this.serviceName
    });
  }

  async getNews(bond: BondInfo|null): Promise<NewsArticle[]> {
    if (!bond) {
      return [];
    }
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
  }

  async getBreakingNews(): Promise<NewsArticle[]> {
    const result = await webApihandler.get(`breaking-news`, {
      limit: 20
    }, {
      serviceName: this.serviceName
    });
    result.articles.forEach((article: NewsArticle) => {
      article.date = new Date(article.date);
    })
    return result.articles.sort((a: NewsArticle, b: NewsArticle) => b.date.getTime() - a.date.getTime());
  }
}

export const productBrowserDataService = new ProductBrowserDataService();