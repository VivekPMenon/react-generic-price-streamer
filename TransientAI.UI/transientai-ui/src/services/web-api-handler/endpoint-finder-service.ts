import { EndpointConfig } from "./model";


class EndpointFinderService {
  // todo.. add code to resolve url based on enviroinment

  getCurrentEnvInfo(): EndpointConfig {
    return {
      env: 'DEV',
      httpsEndpoint: 'https://api-demo.thetransient.ai'
    }
  } 
}

export const endpointFinder = new EndpointFinderService();