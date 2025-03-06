import { webApihandler } from "../web-api-handler";
import { RiskMetricsItem } from "./model";

class RiskDataService {
  private serviceName = 'hurricane-api';

  async getRiskMetrics(): Promise<any> {
    const results = await webApihandler.get('/gs-margin-excess-all', {}, { serviceName: this.serviceName });
    return results;
  }
}

export const riskDataService = new RiskDataService();