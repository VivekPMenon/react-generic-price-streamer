import { endpointFinder } from '@/services/web-api-handler/endpoint-finder-service';
import { PublicClientApplication, Configuration } from '@azure/msal-browser';

const currentEnv = endpointFinder.getCurrentEnvInfo();

const msalConfig: Configuration = {
  auth: {
    clientId: currentEnv.authInfo?.clientId!,
    authority: `https://login.microsoftonline.com/${currentEnv.authInfo?.tenantId}`,
    redirectUri: currentEnv.authInfo?.redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;
