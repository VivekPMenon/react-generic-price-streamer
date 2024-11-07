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
}

// singleton ?
export const webApihandler = new WebApihandler();