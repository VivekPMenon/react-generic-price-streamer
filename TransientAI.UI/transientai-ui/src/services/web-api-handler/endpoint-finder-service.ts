import { EndpointConfig } from "./model";


class EndpointFinderService {
  // todo.. add code to resolve url based on enviroinment

  getCurrentEnvInfo(): EndpointConfig {
    return {
      env: 'DEV',
      httpsEndpoint: 'https://api-demo.thetransient.ai',
      newsApiKey: 'ecf2b4a0ade14e5a8613b8d9fec645a9',
      corpActionApiHeaders: {
            'Ocp-Apim-Subscription-Key': '633e69ff878e439c8c52bc5a5600a031'
      },
      randomStr: '',
      httpsServices: {
        'news-api': 'https://newsapi.org/v2',
        'openai-api': 'https://news-api-r966.onrender.com',
        'hurricane-api': 'https://hurricanecap-devfastapi.azurewebsites.net',
        'corp-actions-api': 'https://hcapcorpactionsapi.azure-api.net/CorporateActionsAPIExecutor'
      }
    }
  }
}

export const endpointFinder = new EndpointFinderService();