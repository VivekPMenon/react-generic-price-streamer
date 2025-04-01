import { create } from "zustand";
import { UserContext, RoleType } from "./model";
import msalInstance from "@/app/msal-config";
import { endpointFinder } from "../web-api-handler/endpoint-finder-service";
import { AccountInfo } from "@azure/msal-browser";
import userGroupUsersJson from "./user-group-users.json";
import axios, { AxiosError } from "axios";
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

export const useUserContextStore = create<UserContextState>((set, get) => ({
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
      const existingToken = sessionStorage.getItem("bearerToken");
      const existingRole = sessionStorage.getItem("role") as RoleType;
      if (existingToken && existingRole) {
        webApihandler.setBearerToken(existingToken);
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          const account = accounts[0];
          const userContext = mapAccountToUser(account, existingRole);
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
        throw new Error("Failed to acquire ID token.");
      }

      const bearerTokenRes = await loginAndSetToken(idToken);
      const role = bearerTokenRes.loginResponse.user_info.role
      if (bearerTokenRes) {
        sessionStorage.setItem("bearerToken", bearerTokenRes.bearerToken);
        sessionStorage.setItem("role", role)
        webApihandler.setBearerToken(bearerTokenRes.bearerToken);
      }

      const userContext = mapAccountToUser(account!, role);
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

const { loadUserContext } = useUserContextStore.getState();
loadUserContext();

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

function mapAccountToUser(account: AccountInfo, role: RoleType): UserContext {
  const parts = account.name?.split(' ') || [];
  const initials = parts[0]?.[0]?.toUpperCase() + (parts.at(-1)?.[0]?.toUpperCase() || '');

  return {
    userName: account.name,
    token: account.idToken,
    userId: account.username,
    userInitials: initials,
    role: role,
  };
}