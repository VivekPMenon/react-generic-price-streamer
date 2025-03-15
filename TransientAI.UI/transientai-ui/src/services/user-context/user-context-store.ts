import { create } from 'zustand';
import { UserContext, RoleType } from './model';
import msalInstance from '@/app/msal-config';
import { endpointFinder } from '../web-api-handler/endpoint-finder-service';
import { AccountInfo } from '@azure/msal-browser';
import userGroupUsersJson from './user-group-users.json';

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

  clearUserContext: () => set({ userContext: {} }),

  loadUserContext: async () => {
    const currentEnv = endpointFinder.getCurrentEnvInfo();

    try {
      if (currentEnv.isAuthDisabled) {
        set({ isAuthenticated: true, isLoading: false });
        return;
      }

      set({ isLoading: true });

      await msalInstance.initialize();

      const response = await msalInstance.handleRedirectPromise();
      if (response && response.account) {
        const userContext = mapAccountToUser(response.account);
        set({ userContext, isAuthenticated: true, isLoading: false });
        return;
      }

      // Try sessionStorage cache first
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        const userContext = mapAccountToUser(accounts[0]);
        set({ userContext, isAuthenticated: true, isLoading: false });
        return;
      }

      const silentResponse = await msalInstance.ssoSilent({
        scopes: [currentEnv.authInfo?.scope!],
      });

      const userContext = mapAccountToUser(silentResponse.account);
      set({ userContext, isAuthenticated: true, isLoading: false });
      return;
    } catch (error) {
      console.error('Authentication error:', error);
      set({ isLoading: false, authenticationError: (error as any).message });

      // Prevent infinite redirect loop by checking error type
      if ((error as any).name !== 'InteractionRequiredAuthError') {
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

function mapAccountToUser(account: AccountInfo): UserContext {
  const parts = account.name?.split(' ') || [];
  const initials = parts[0]?.[0]?.toUpperCase() + (parts.at(-1)?.[0]?.toUpperCase() || '');

  const userGroupUsers = userGroupUsersJson.find(userGroupUser => userGroupUser.UserId?.toLowerCase() === account?.username?.toLowerCase());

  return {
    userName: account.name,
    token: account.idToken,
    userId: account.username,
    userInitials: initials,
    role: userGroupUsers?.GroupId as RoleType,
  };
}

