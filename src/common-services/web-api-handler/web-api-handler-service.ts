import axios from "axios";
import { WebApihandlerOptions } from "./model";

class WebApihandler {
  
  constructor() {        
  }

  async get(url:string, options?: WebApihandlerOptions)  {
    // todo.. caching 

    const result = await axios({
      url,
      method: 'GET'
    });

    return result.data;
  }

  async post(url: string, data: object, webApiOptions?: WebApihandlerOptions) {
    // caching if needed

    const apiResult = await axios({
        url,
        method: 'POST',
        data,
        ...webApiOptions
    });

    return apiResult.data;
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

// singleton ?
export const webApihandler = new WebApihandler();
