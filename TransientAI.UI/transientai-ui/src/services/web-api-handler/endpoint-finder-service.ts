import { getConfig } from "@/app/endpoint-config";
import { EndpointConfig } from "./model";

class EndpointFinderService {
  getCurrentEnvInfo(): EndpointConfig {
    return getConfig();
  }
}

export const endpointFinder = new EndpointFinderService();