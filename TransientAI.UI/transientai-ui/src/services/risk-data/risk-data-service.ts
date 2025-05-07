import { webApihandler } from "../web-api-handler";

class RiskDataService {
  private serviceName = 'hurricane-api-2-0';

  async getRiskMetrics(): Promise<any> {
    return await webApihandler.get('margin/gs-margin-excess', {}, { serviceName: this.serviceName });
  }
}

export const riskDataService = new RiskDataService();