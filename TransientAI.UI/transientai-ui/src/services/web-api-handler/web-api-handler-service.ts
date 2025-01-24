import axios from "axios";
import { WebApihandlerOptions } from "./model";
import { endpointFinder } from "./endpoint-finder-service";

class WebApihandler {
  
  private readonly bankId = 123;
  private readonly viewId = 101;
  readonly userId ='e7e02b68-1234-4c7f-a0db-5fd57d688d4c';

  constructor() {        
  }

  async get(url:string, params: {[key: string]: any}, options?: WebApihandlerOptions)  {
    // todo.. caching 
     const currentEnv = endpointFinder.getCurrentEnvInfo();

     const httpsEndpoint = options?.serviceName ? currentEnv.httpsServices![options.serviceName] : currentEnv.httpsEndpoint; 
     const finalUrl = `${httpsEndpoint}/${url}`;

    const result = await axios({
      url: finalUrl,
      params: {
        bank_id: this.bankId,
        view_id: this.viewId,
        user_id: this.userId,
        ...params
      },
      method: 'GET'
    });

    return result.data;
  }

  async getStream(url:string, params: {[key: string]: any}, options?: WebApihandlerOptions)  {
     const currentEnv = endpointFinder.getCurrentEnvInfo();
     const finalParams = {...params, user_id: this.userId};
     const finalUrl = `${currentEnv.httpsEndpoint}/${url}?${new URLSearchParams(finalParams).toString()}`;

     return await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  async post(url:string, data: any, params?: {[key: string]: any}, options?: WebApihandlerOptions)  {
    // todo.. caching 
     const currentEnv = endpointFinder.getCurrentEnvInfo();
     const finalUrl = `${currentEnv.httpsEndpoint}/${url}`;

    const result = await axios({
      url: finalUrl,
      params: {
        bank_id: this.bankId,
        view_id: this.viewId,
        user_id: this.userId,
        ...params
      },
      data,
      method: 'POST'
    });

    return result.data;
  }

  async put(url: string, data: object, webApiOptions?: WebApihandlerOptions) {
    // caching if needed

    const apiResult = await axios({
        url,
        method: 'PUT',
        data,
        ...webApiOptions
    });

    return apiResult.data;
  }

  async delete(url: string, webApiOptions?: WebApihandlerOptions) {
    // caching if needed

    const apiResult = await axios({
        url,
        method: 'DELETE',
        ...webApiOptions
    });

    return apiResult.data;
  }

}

export const webApihandler = new WebApihandler();
