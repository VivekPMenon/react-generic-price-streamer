import { AxiosRequestConfig } from "axios";

export interface WebApihandlerOptions extends AxiosRequestConfig {
  cache?: boolean;
  serviceName?: string;
}

export interface EndpointConfig {
  env?: string;
  httpsEndpoint?: string;
  newsApiKey?: string;
  corpActionApiHeaders: {[key: string]: string};
  randomStr?: string;
  httpsServices?: { [name: string]: string };
  headers?: { [name: string]: string };
  authInfo?: AuthenticationInfo;
  isAuthDisabled?: boolean;  
}

export interface AuthenticationInfo {
  clientId?: string;
  tenantId?: string;
  redirectUri?: string;
  scope?: string;
}