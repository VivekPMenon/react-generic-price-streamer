import { EndpointConfig } from "@/services/web-api-handler";

export const getConfig = (): EndpointConfig => {
  const env = process.env.NEXT_PUBLIC_ENV || 'LOCAL';
    
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000';

  return {
    env,
    httpsEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || '',
    corpActionApiHeaders: {
      'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CORP_API_SUBSCRIPTION_KEY || ''
    },
    randomStr: '',
    httpsServices: {
      'news-api': process.env.NEXT_PUBLIC_NEWS_API_URL || '',
      'openai-api': process.env.NEXT_PUBLIC_OPENAI_API_URL || '',
      'hurricane-api': process.env.NEXT_PUBLIC_HURRICANE_API_URL || '',
      'hurricane-api-2-0': process.env.NEXT_PUBLIC_HURRICANE_API_2_0_URL || '',
      'corp-actions-api': process.env.NEXT_PUBLIC_CORP_ACTIONS_API_URL || '',
      'sell-side-api': process.env.NEXT_PUBLIC_SELL_SIDE_API_URL || '',
      'api-dev': process.env.NEXT_PUBLIC_API_DEV_URL || ''
    },
    isAuthDisabled: false,
    authInfo: {
      clientId: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || '',
      tenantId: process.env.NEXT_PUBLIC_AUTH_TENANT_ID || '',
      redirectUri,
      scope: process.env.NEXT_PUBLIC_AUTH_SCOPE || ''
    }
  };
};
