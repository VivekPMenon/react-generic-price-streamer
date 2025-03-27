import { create } from 'zustand';
import { CorporateAction } from './model';
import { corpActionsDataService } from './corporate-actions-data';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';
import { areObjectsEqual } from '@/lib/utility-functions';

export const resourceName = 'corporate-actions';

export interface CorpActionsDataState {
  corpActions: CorporateAction[];
  loadedCorpActions: CorporateAction[];
  searchedEventIds: Set<string>;
  selectedCorpAction: CorporateAction | null;
  isLoading: boolean;
  isSearching: boolean;
  searchCorpActions: (query: string) => void;
  setSelectedCorpAction: (corpAction: CorporateAction | null) => void;
  setCorpActions: (corpActionsData: CorporateAction[]) => void;
  loadCorpActions: () => Promise<void>;
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

  setCorpActions: (corpActions) => set({ corpActions }),
  setSelectedCorpAction: (corpAction) => set({ selectedCorpAction: corpAction }),

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

    }, 2000); // Polls every 2 minutes
  }
}));

// Initial Load and Start Polling
const { loadCorpActions, startPolling } = useCorpActionsStore.getState();
loadCorpActions();
startPolling();
