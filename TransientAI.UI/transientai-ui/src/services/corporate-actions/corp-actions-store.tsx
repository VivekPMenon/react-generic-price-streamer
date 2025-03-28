import { create } from 'zustand';
import { CorporateAction } from './model';
import { corpActionsDataService } from './corporate-actions-data';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';
import { areObjectsEqual } from '@/lib/utility-functions';
import { IPmCorporateAction } from '@/components/corporate-actions/pm-corporate-action/models';

export const resourceName = 'corporate-actions';

export interface CorpActionsDataState {
  corpActions: CorporateAction[];
  loadedCorpActions: CorporateAction[];
  searchedEventIds: Set<string>;
  selectedCorpAction: CorporateAction | null;
  isLoading: boolean;
  isSearching: boolean;
  sortByAction: boolean;
  filterActions: {
    actionType: string | null;
    securityTicker: string | null;
    securityidentifier: string | null;
    dateRange: string | null;
    corpActionId: string | null;
    eventStatus: string | null;
    eventType: string | null;
    account: string | null;
  };
  setSortByAction: (sortByAction: boolean) => void;
  setFilterActions: (key: string, filters: Partial<CorpActionsDataState['filterActions']>) => void;
  searchCorpActions: (query: string) => void;
  setSelectedCorpAction: (corpAction: CorporateAction | null) => void;
  setCorpActions: (corpActionsData: CorporateAction[]) => void;
  loadCorpActions: () => Promise<void>;
  loadPmCorpActions: () => Promise<void>;
  loadCorpActionDetail: (eventId: string) => Promise<CorporateAction>;
  startPolling: () => void;
}

export const useCorpActionsStore = create<CorpActionsDataState>((set, get) => ({
  corpActions: [],
  loadedCorpActions: [],
  searchedEventIds: new Set<string>(),
  selectedCorpAction: null,
  isLoading: false,
  isSearching: false,
  sortByAction: true,
  reset: {},
  filterActions: {
    actionType: null,
    securityTicker: null,
    securityidentifier: null,
    dateRange: null,
    corpActionId: null,
    eventStatus: null,
    eventType: null,
    account: null
  },

  setCorpActions: (corpActions) => set({ corpActions }),
  setSelectedCorpAction: (corpAction) => set({ selectedCorpAction: corpAction }),
  setSortByAction: (sortByAction) => set({ sortByAction }),
  setFilterActions: (key, value) => set((state) => ({
    filterActions: { 
      ...state.filterActions,
      [key]: value,
    }
  })),

  loadCorpActions: async () => {
    set({ isLoading: true });

    try {
      const newCorpActions = await corpActionsDataService.getCorpActions();

      newCorpActions.sort((a: CorporateAction, b: CorporateAction) => {
        const aDate = a?.receivedDate ? new Date(a.receivedDate).getTime() : -1;
        const bDate = b?.receivedDate ? new Date(b.receivedDate).getTime() : -1;
        return bDate - aDate;
      });

      const eventIds = get().searchedEventIds;
      if (eventIds.size > 0) {
        const filtered = newCorpActions.filter(ca => eventIds.has(ca.eventId));
        set({
          corpActions: filtered,
          loadedCorpActions: newCorpActions,
          isLoading: false,
        });
      } else {
        set({
          corpActions: newCorpActions,
          loadedCorpActions: newCorpActions,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error loading corporate actions:', error);
      set({ isLoading: false });
    }
  },
  loadPmCorpActions: async () => {
    set({ isLoading: true });

    try {
      const newCorpActions = await corpActionsDataService.getPmCorpActions();

      newCorpActions.sort((a: IPmCorporateAction, b: IPmCorporateAction) => {
        const aDate = a?.receivedDate ? new Date(a.receivedDate).getTime() : -1;
        const bDate = b?.receivedDate ? new Date(b.receivedDate).getTime() : -1;
        return bDate - aDate;
      });

      const eventIds = get().searchedEventIds;
      if (eventIds.size > 0) {
        const filtered = newCorpActions.filter(ca => eventIds.has(ca.eventId));
        set({
          corpActions: filtered,
          loadedCorpActions: newCorpActions,
          isLoading: false,
        });
      } else {
        set({
          corpActions: newCorpActions,
          loadedCorpActions: newCorpActions,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error loading corporate actions:', error);
      set({ isLoading: false });
    }
  },

  searchCorpActions: async (query: string) => {
    set({ isSearching: true });

    try {
      if (!query || query.trim().length === 0) {
        set({ corpActions: get().loadedCorpActions, searchedEventIds: new Set<string>() });
        return;
      }

      const eventIds = new Set(await corpActionsDataService.searchCorpAction(query));
      const filtered = get().loadedCorpActions.filter(ca => eventIds.has(ca.eventId));
      set({ corpActions: filtered, searchedEventIds: eventIds });
    } catch (error) {
      console.error('Error searching corporate actions:', error);
    } finally {
      set({ isSearching: false });
    }
  },

  loadCorpActionDetail: async (eventId: string) => {
    return await corpActionsDataService.getCorpActionDetail(eventId);
  },

  startPolling: () => {
    setInterval(async () => {
      const { loadedCorpActions } = get();
      const prevCount = loadedCorpActions.length;

      const newCorpActions = await corpActionsDataService.getCorpActions();
      if (areObjectsEqual(loadedCorpActions, newCorpActions)) {
        return;
      }

      set({ loadedCorpActions: newCorpActions });

      const newCount = newCorpActions.length;
      const unseenDiff = newCount - prevCount;

      useUnseenItemsStore.getState().addUnseenItems(resourceName, unseenDiff);

    }, 120000); // Polls every 2 minutes
  }
}));

// Initial Load and Start Polling
const { loadCorpActions, startPolling } = useCorpActionsStore.getState();
loadCorpActions();
startPolling();
