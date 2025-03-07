import { create } from 'zustand';
import { UserContext, RoleType } from './model';

interface UserContextState {
  userContext: UserContext;
  authenticationError: string;
  isLoading: boolean;
  setUserContext: (userContext: UserContext) => void;
  clearUserContext: () => void;
  loadUserContext: () => Promise<void>;
}

export const useUserContextStore = create<UserContextState>((set, get) => ({
  userContext: {},
  isLoading: false,
  authenticationError: '',
  setUserContext: (userContext) => set({ userContext }),
  clearUserContext: () => set({ userContext: {} }),
  loadUserContext: async () => {
    // hack until we get it from oidc
    const urlParams = new URLSearchParams(window.location.search);
    const userRoleType = urlParams.get('userRoleType');

    const userContext: UserContext = { token: '' };
    if (userRoleType) {
      userContext.role = userRoleType as RoleType;
    } else {
      userContext.role = RoleType.Trader;
    }

    userContext.userName = 'Chris Napoli';
    userContext.userId = 'Chris Napoli'; // ideally a unique id from the vendor OAuth provider

    set({ userContext });
  },
}));

const { loadUserContext } = useUserContextStore.getState();
loadUserContext();
