import { create } from "zustand";
import { UserContext, UserInfo } from "./model";
import msalInstance from "@/app/msal-config";
import { endpointFinder } from "../web-api-handler/endpoint-finder-service";
import { AccountInfo } from "@azure/msal-browser";
import axios from "axios";
import { webApihandler } from "../web-api-handler";
interface UserContextState {
  userContext: UserContext;
  authenticationError: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUserContext: (userContext: UserContext) => void;
  clearUserContext: () => void;
  loadUserContext: () => Promise<void>;
}

export const useUserContextStore = create<UserContextState>((set) => ({
  userContext: {},
  isLoading: false,
  isAuthenticated: false,
  authenticationError: '',

  setUserContext: (userContext) => set({ userContext }),

  clearUserContext: () => {
    sessionStorage.removeItem("bearerToken");
    set({ userContext: {} })
  },

  loadUserContext: async () => {
    const currentEnv = endpointFinder.getCurrentEnvInfo();

    try {
      if (currentEnv.isAuthDisabled) {
        set({ isAuthenticated: true, isLoading: false });
        return;
      }

      set({ isLoading: true });

      // Skip login API call if a token is already stored in sessionStorage 
      const existingToken = webApihandler.getBearerTokenToSession();
      const getUserInfo = sessionStorage.getItem("userInfo");
      const existingUserInfo = getUserInfo && JSON.parse(getUserInfo) as UserInfo;
      if (existingToken && existingUserInfo) {
        webApihandler.setBearerTokenToSession(existingToken);
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          const account = accounts[0];
          const userContext = mapAccountToUser(account, existingUserInfo);
          set({ userContext, isAuthenticated: true, isLoading: false });
          return;
        }
      }

      await msalInstance.initialize();

      const response = await msalInstance.handleRedirectPromise();

      let account = response?.account;
      let idToken = response?.idToken;

      if (!account) {
        // Try sessionStorage cache first
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          account = accounts[0];
        }
      }

      if (!account) {
        await msalInstance.loginRedirect({
          scopes: [currentEnv.authInfo?.scope!],
        });
        return;
      }

      if (!idToken) {
        // If idToken is missing, try acquiring it silently
        const tokenResponse = await msalInstance.acquireTokenSilent({
          scopes: [currentEnv.authInfo?.scope!],
          account,
        });
        idToken = tokenResponse.idToken;
      }

      if (!idToken) {
        set({ isLoading: false, authenticationError: "Failed to acquire ID token." });
        return;
      }

      const bearerTokenRes = await loginAndSetToken(idToken);
      const userInfo:UserInfo = bearerTokenRes.loginResponse.user_info;

      if (bearerTokenRes) {
        webApihandler.setBearerTokenToSession(bearerTokenRes.bearerToken)
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      const userContext = mapAccountToUser(account!, userInfo);
      set({ userContext, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Authentication error:", error);
      set({ isLoading: false, authenticationError: (error as any).message });

      // Prevent infinite redirect loop by checking error type
      if ((error as any).name !== "InteractionRequiredAuthError") {
        return;
      }

      // Perform interactive login as a last resort
      await msalInstance.loginRedirect({
        scopes: [currentEnv.authInfo?.scope!],
      });
    }
  },
}));

async function loginAndSetToken(idToken: string) {
  try {

    const currentEnv = endpointFinder.getCurrentEnvInfo();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await axios.post(
      `${currentEnv.httpsServices!["hurricane-api-2-0"]}/auth/login`,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          timezone: timezone,
        },
      }
    );

    const bearerToken = response.headers["authorization"].split(" ")[1];
    return {
      bearerToken,
      loginResponse: response.data
    };
  } catch (error) {
    console.error("Login API error:", error);
    throw new Error("Invalid login response");
  }
}

function mapAccountToUser(account: AccountInfo,userInfo: UserInfo): UserContext {
  const parts = account.name?.split(' ') || [];
  const initials = parts[0]?.[0]?.toUpperCase() + (parts.at(-1)?.[0]?.toUpperCase() || '');
  
  return {
    userName: account.name,
    token: account.idToken,
    userId: account.username,
    userInitials: initials,
    role: userInfo.role,
    userInfo: userInfo
  };
}