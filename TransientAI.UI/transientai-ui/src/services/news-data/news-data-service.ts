import { webApihandler } from "../web-api-handler";
import { endpointFinder } from "../web-api-handler/endpoint-finder-service";
import { Article } from "./model";


class NewsDataService {

  readonly newsApiName = 'news-api';

  async getArticles(): Promise<Article[]> {
    const result = await webApihandler.get('top-headlines', {
      country: 'us',
      apiKey: endpointFinder.getCurrentEnvInfo().newsApiKey
    }, {
      serviceName: this.newsApiName
    });

    return result.articles;
  }
}

export const newsDataService = new NewsDataService();