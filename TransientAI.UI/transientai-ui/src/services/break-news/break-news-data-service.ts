import { webApihandler } from "../web-api-handler";
// import { BreakNewsItem } from "./model";

class BreakNewsDataService {
  private serviceName = 'hurricane-api';

  async getBreakNews(): Promise<any> {
    const results = await webApihandler.get('/entity/records/', {}, { serviceName: this.serviceName });
    return results;
  }
}

export const breakNewsDataService = new BreakNewsDataService();