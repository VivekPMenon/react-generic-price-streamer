import { webApihandler } from "../web-api-handler";

class RiskDataService {
  private serviceName = 'hurricane-api';

  async getRiskMetrics(): Promise<any> {
    return await webApihandler.get('/gs-margin-excess-all', {}, { serviceName: this.serviceName });
  }
}

export const riskDataService = new RiskDataService();