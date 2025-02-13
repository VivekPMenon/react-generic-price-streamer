import { EndpointConfig } from "./model";


class EndpointFinderService {
  // todo.. add code to resolve url based on enviroinment

  getCurrentEnvInfo(): EndpointConfig {
    return {
      env: 'DEV',
      httpsEndpoint: 'https://api-demo.thetransient.ai',
      newsApiKey: 'ecf2b4a0ade14e5a8613b8d9fec645a9',
      randomStr: '',
      httpsServices: {
        'news-api': 'https://newsapi.org/v2',
        'openai-api': 'https://news-api-r966.onrender.com'
      }
    }
  }
}

export const endpointFinder = new EndpointFinderService();