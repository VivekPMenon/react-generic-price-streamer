import { endpointConfigs } from "@/app/endpoint-config";
import { EndpointConfig } from "./model";


class EndpointFinderService {

  // host name based look may not scale, will ned to resolve this from nextjs server side using environment variables
  getCurrentEnvInfo(): EndpointConfig {
    const currentHost = window.location.hostname;
    const config = endpointConfigs[currentHost];

    if (config) {
      return config;
    }

    return endpointConfigs['localhost'];
  }
}

export const endpointFinder = new EndpointFinderService();
