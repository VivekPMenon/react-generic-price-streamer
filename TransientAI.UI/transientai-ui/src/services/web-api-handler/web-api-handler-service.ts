import axios from "axios";
import { WebApihandlerOptions } from "./model";
import { endpointFinder } from "./endpoint-finder-service";

class WebApihandler {

  private readonly bankId = 123;
  private readonly viewId = 101;
  readonly userId = 'e7e02b68-1234-4c7f-a0db-5fd57d688d4c';
  private bearerToken = '';

  constructor() {
  }

  setBearerToken(token: string) {
    this.bearerToken = token;
  }

  async get(url: string, params: { [key: string]: any }, options?: WebApihandlerOptions) {
    // todo.. caching
    const finalUrl = this.getUrl(url, options);

    const result = await axios({
      url: finalUrl,
      params: {
        bank_id: this.bankId,
        view_id: this.viewId,
        user_id: this.userId,
        ...params
      },
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        ...options?.headers
      }
    });

    return result.data;
  }

  async getStream(url: string, params: { [key: string]: any }, options?: WebApihandlerOptions) {
    const currentEnv = endpointFinder.getCurrentEnvInfo();
    const finalParams = { ...params, user_id: this.userId };
    const finalUrl = `${currentEnv.httpsEndpoint}/${url}?${new URLSearchParams(finalParams).toString()}`;

    return await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  async post(url: string, data: any, params?: { [key: string]: any }, options?: WebApihandlerOptions) {
    const finalUrl = this.getUrl(url, options);
    console.log(finalUrl);


    const result = await axios({
      url: finalUrl,
      params: {
        bank_id: this.bankId,
        view_id: this.viewId,
        user_id: this.userId,
        ...params
      },
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        ...options?.headers
      },
      data,
      method: 'POST'
    });

    return result.data;
  }

  async put(url: string, data: any, params?: { [key: string]: any }, webApiOptions?: WebApihandlerOptions) {
    // caching if needed
    const finalUrl = this.getUrl(url, webApiOptions);

    const apiResult = await axios({
      url: finalUrl,
      method: 'PUT',
      params: {
        bank_id: this.bankId,
        view_id: this.viewId,
        user_id: this.userId,
        ...params
      },
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
      },
      data,
      ...webApiOptions
    });

    return apiResult.data;
  }

  async delete(url: string, webApiOptions?: WebApihandlerOptions) {
    const finalUrl = this.getUrl(url, webApiOptions);

    const apiResult = await axios({
      url: finalUrl,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        ...webApiOptions?.headers
      }
    });

    return apiResult.data;
  }

  getUrl(url: string, options?: WebApihandlerOptions, params?: { [key: string]: any }): string {
    const currentEnv = endpointFinder.getCurrentEnvInfo();
    const httpsEndpoint = options?.serviceName ? currentEnv.httpsServices![options.serviceName] : currentEnv.httpsEndpoint;

    let finalUrl = `${httpsEndpoint}/${url}`;
    if (params && params.lenth) {
      finalUrl += `?${new URLSearchParams(params).toString()}`
    }
    return finalUrl;
  }

}

export const webApihandler = new WebApihandler();
