import { create } from 'zustand';
import { UserContext, RoleType } from './model';

interface UserContextState {
  userContext: UserContext;
  setUserContext: (userContext: UserContext) => void;
  clearUserContext: () => void;
  loadUserContext: () => Promise<void>;
}

export const useUserContextStore = create<UserContextState>((set, get) => ({
  userContext: {},
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

    set({ userContext });
  },
}));

const { loadUserContext } = useUserContextStore.getState();
loadUserContext();
