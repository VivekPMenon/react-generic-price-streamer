import { create } from 'zustand';
import { CorporateAction } from './model';
import { corpActionsDataService } from './corporate-actions-data';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';

export const resourceName = 'corporate-actions';

export interface CorpActionsDataState {
  corpActions: CorporateAction[];
  selectedCorpAction: CorporateAction | null;
  isLoading: boolean;
  setSelectedCorpAction: (corpAction: CorporateAction | null) => void;
  setCorpActions: (corpActionsData: CorporateAction[]) => void;
  loadCorpActions: () => Promise<void>;
  loadCorpActionDetail: (eventId: string) => Promise<CorporateAction>;
  startPolling: () => void;
}

export const useCorpActionsStore = create<CorpActionsDataState>((set, get) => ({
  corpActions: [],
  selectedCorpAction: null,
  isLoading: false,

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

      set((state) => ({
        corpActions: newCorpActions,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading corporate actions:', error);
      set({ isLoading: false });
    }
  },

  loadCorpActionDetail: async (eventId: string) => {
    return await corpActionsDataService.getCorpActionDetail(eventId);
  },

  startPolling: () => {
    setInterval(async () => {
      const prevCount = get().corpActions.length;

      await get().loadCorpActions();

      set((state) => {
        const newCount = state.corpActions.length;
        const unseenDiff = newCount - prevCount;

        if (unseenDiff > 0) {
          useUnseenItemsStore.getState().addUnseenItems(resourceName, unseenDiff);
        }

        return {}; // No need to modify state here, just ensuring correctness
      });
    }, 120000); // Polls every 2 minutes
  }
}));

// Initial Load and Start Polling
const { loadCorpActions, startPolling } = useCorpActionsStore.getState();
loadCorpActions();
startPolling();
