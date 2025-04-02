import { EndpointConfig } from "@/services/web-api-handler";

const devHttpServices = {
  'news-api': 'https://newsapi.org/v2',
  'openai-api': 'https://news-api-r966.onrender.com',
  'hurricane-api': 'https://hurricanecap-devfastapi.azurewebsites.net',
  'hurricane-api-2-0': 'https://hurricane-dev-api01.purplebay-509ff298.eastus2.azurecontainerapps.io',
  'corp-actions-api': 'https://hcapcorpactionsapi.azure-api.net/CorporateActionsAPIExecutor'
};

const devCorpApiHeaders = {
  'Ocp-Apim-Subscription-Key': '633e69ff878e439c8c52bc5a5600a031'
};

const devAuthInfo = {
  clientId: '0c97ab31-64c5-4b64-9bf3-487aa1263b61',
  tenantId: '93d4e288-2dde-4182-acf6-653a54c2da69',
  redirectUri: 'http://localhost:3000',
  scope: 'https://graph.microsoft.com/.default'
};

export const endpointConfigs: { [host: string]: EndpointConfig } = {
  'localhost': {
    env: 'LOCAL',
    httpsEndpoint: 'https://api-demo.thetransient.ai',
    corpActionApiHeaders: devCorpApiHeaders,
    randomStr: '',
    httpsServices: devHttpServices,
    isAuthDisabled: false,
    authInfo: {
      ...devAuthInfo,
      redirectUri: 'http://localhost:3000'
    }
  },
  'react-generic-price-streamer.vercel.app': {
    env: 'DEV',
    httpsEndpoint: 'https://api-demo.thetransient.ai',
    corpActionApiHeaders: devCorpApiHeaders,
    randomStr: '',
    httpsServices: devHttpServices,
    isAuthDisabled: false,
    authInfo: {
      ...devAuthInfo,
      redirectUri: 'https://react-generic-price-streamer.vercel.app'
    }
  },
  'hurricanecap-eff0hjhehxebcpbf.eastus2-01.azurewebsites.net': {
    env: 'UAT',
    httpsEndpoint: 'https://api-demo.thetransient.ai',
    corpActionApiHeaders: devCorpApiHeaders,
    randomStr: '',
    httpsServices: devHttpServices,
    isAuthDisabled: false,
    authInfo: {
      ...devAuthInfo,
      redirectUri: 'https://hurricanecap-eff0hjhehxebcpbf.eastus2-01.azurewebsites.net/'
    }
  }
};
