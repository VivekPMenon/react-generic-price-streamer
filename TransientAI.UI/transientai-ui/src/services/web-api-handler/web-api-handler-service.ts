import axios, {AxiosRequestConfig, Method} from "axios";
import { WebApihandlerOptions} from "./model";
import { endpointFinder } from "./endpoint-finder-service";
import { useUserContextStore } from '@/services/user-context'
import msalInstance from "@/app/msal-config";

class WebApihandler {
  private readonly bankId = 123;
  private readonly viewId = 101;
  readonly userId = 'e7e02b68-1234-4c7f-a0db-5fd57d688d4c';
  private bearerToken = '';
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor() {}

  setBearerToken(token: string) {
    this.bearerToken = token;
  }

  private async ensureToken(): Promise<void> {
    while (!this.bearerToken) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async refreshToken(): Promise<string> {
    if (this.isRefreshing) return this.refreshPromise!;

    this.isRefreshing = true;

    try {
      this.refreshPromise = new Promise(async (resolve, reject) => {
        const currentEnv = endpointFinder.getCurrentEnvInfo();
        const loginUrl = `${currentEnv.httpsServices!["hurricane-api-2-0"]}/auth/login`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const { userContext, setUserContext } = useUserContextStore.getState();

        try {
          const response = await axios.post(loginUrl, {}, {
            headers: {
              Authorization: `Bearer ${userContext.token}`,
              timezone: timezone,
            },
          });

          const newToken = response.headers["authorization"].split(" ")[1];
          this.setBearerToken(newToken);
          resolve(newToken);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            try {
              const account = msalInstance.getAllAccounts()[0];
              if (!account) throw new Error("No account found in MSAL");

              const tokenResponse = await msalInstance.acquireTokenSilent({
                scopes: [currentEnv.authInfo?.scope!],
                account: account,
              });

              const microsoftRefreshToken = tokenResponse.idToken;
              const loginResponse = await axios.post(loginUrl, {}, {
                headers: {
                  Authorization: `Bearer ${microsoftRefreshToken}`,
                  timezone: timezone,
                },
              });

              const newToken = loginResponse.headers["authorization"].split(" ")[1];
              this.setBearerToken(newToken);
              setUserContext({ ...userContext, token: newToken });
              resolve(newToken);
            } catch (msError) {
              console.error("Failed to refresh token:", msError);
              reject(msError);
            }
          } else {
            reject(error);
          }
        } finally {
          this.isRefreshing = false;
          this.refreshPromise = null;
        }
      });

      return await this.refreshPromise;
    } catch (error) {
      this.isRefreshing = false;
      this.refreshPromise = null;
      throw error;
    }
  }

  private async executeRequest(config: AxiosRequestConfig): Promise<any> {
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          await this.refreshToken();
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${this.bearerToken}`,
          };
          const retryResponse = await axios(config);
          return retryResponse.data;
        } catch (error) {
          console.error("Failed to refresh token:", error);
          throw error;
        }
      }
      throw error;
    }
  }

  async get(url: string, params: { [key: string]: any }, options?: WebApihandlerOptions): Promise<any> {
    await this.ensureToken();
    const finalUrl = this.getUrl(url, options);
    const config: AxiosRequestConfig = {
      url: finalUrl,
      params: {
        bank_id: this.bankId,
        view_id: this.viewId,
        user_id: this.userId,
        ...params
      },
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        ...options?.headers
      }
    };
    return this.executeRequest(config);
  }

  async execute(
      url: string,
      method: Method | string,
      data?: any,
      params?: { [key: string]: any },
      headers?: { [key: string]: string },
      serviceName?: string) {
    await this.ensureToken();

    if (!params) {
      params = {};
    }

    params = {
      bank_id: this.bankId,
      view_id: this.viewId,
      user_id: this.userId,
      ...params
    };

    const finalUrl = this.getUrl(url, {serviceName}, params);
    const headers_ = new Headers(headers);
    headers_.append('Authorization', `Bearer ${this.bearerToken}`);

    return fetch(finalUrl, {
      method,
      headers: headers_,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async post(url: string, data: any, params?: { [key: string]: any }, options?: WebApihandlerOptions) {
    await this.ensureToken();
    const finalUrl = this.getUrl(url, options);
    const config: AxiosRequestConfig = {
      url: finalUrl,
      params: {
        bank_id: this.bankId,
        view_id: this.viewId,
        user_id: this.userId,
        ...params
      },
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        ...options?.headers
      },
      data,
      method: 'POST'
    };
    return this.executeRequest(config);
  }

  async postTranslate(text: string, targetLanguage: string): Promise<string> {
    await this.ensureToken();
    const currentEnv = endpointFinder.getCurrentEnvInfo()!;
    const translateUrl = `${currentEnv.httpsServices!["hurricane-api-2-0"]}/translate`;

    const config: AxiosRequestConfig = {
      url: translateUrl,
      method: 'POST',
      data: {
        text,
        target_language: targetLanguage
      },
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json'
      }
    };

    const result = await this.executeRequest(config);
    return result.translated_text;
  }

  getUrl(url: string, options?: {serviceName?: string}, params?: { [key: string]: any }): string {
    const currentEnv = endpointFinder.getCurrentEnvInfo();
    const httpsEndpoint = options?.serviceName ? currentEnv.httpsServices![options.serviceName] : currentEnv.httpsEndpoint;
    let finalUrl = `${httpsEndpoint}/${url}`;
    if (params && Object.keys(params).length) {
      finalUrl += `?${new URLSearchParams(params).toString()}`
    }
    return finalUrl;
  }

  async getStream(url: string, params: { [key: string]: any }, options?: WebApihandlerOptions) {
    // const currentEnv = endpointFinder.getCurrentEnvInfo();
    const finalParams = { ...params, user_id: this.userId };
    // const finalUrl = `${currentEnv.httpsEndpoint}/${url}?${new URLSearchParams(finalParams).toString()}`;
    const finalUrl = `https://api-dev.thetransient.ai/${url}?${new URLSearchParams(finalParams).toString()}`;

    return await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async put(url: string, data: any, params?: { [key: string]: any }, webApiOptions?: WebApihandlerOptions) {
    const finalUrl = this.getUrl(url, webApiOptions);
    const config: AxiosRequestConfig = {
      url: finalUrl,
      method: 'PUT',
      params: {
        bank_id: this.bankId,
        view_id: this.viewId,
        user_id: this.userId,
        ...params
      },
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
      },
      data,
      ...webApiOptions
    };
    return this.executeRequest(config);
  }

  async delete(url: string, webApiOptions?: WebApihandlerOptions, params?: { [key: string]: any }) {
    const finalUrl = this.getUrl(url, webApiOptions);
    const config: AxiosRequestConfig = {
      url: finalUrl,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        ...webApiOptions?.headers
      },
      params
    };
    return this.executeRequest(config);
  }
}

export const webApihandler = new WebApihandler();
