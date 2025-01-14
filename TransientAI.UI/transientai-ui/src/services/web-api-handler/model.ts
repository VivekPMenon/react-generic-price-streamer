import { AxiosRequestConfig } from "axios";

export interface WebApihandlerOptions extends AxiosRequestConfig {
  cache?: boolean;
}

export interface EndpointConfig {
  env?: string;
  httpsEndpoint?: string;
}