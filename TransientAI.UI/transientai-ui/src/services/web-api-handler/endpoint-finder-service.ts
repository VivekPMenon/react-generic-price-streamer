import { EndpointConfig } from "./model";


class EndpointFinderService {
  // todo.. add code to resolve url based on environment

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
      },
      isAuthDisabled: false,
      authInfo: {
        clientId: '0c97ab31-64c5-4b64-9bf3-487aa1263b61',
        tenantId: '93d4e288-2dde-4182-acf6-653a54c2da69',
        redirectUri: 'http://localhost:3000',
        scope: 'https://graph.microsoft.com/.default'
      }
    }
  }
}

export const endpointFinder = new EndpointFinderService();