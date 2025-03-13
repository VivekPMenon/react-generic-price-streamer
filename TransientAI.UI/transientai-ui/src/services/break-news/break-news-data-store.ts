
import { create } from 'zustand';
import { BreakNewsItem } from './model'
import { breakNewsDataService } from './break-news-data-service';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';


export const resourceName = 'break-news';
export interface BreakNewsDataState {
  breakNewsItems: BreakNewsItem[];
  setBreakNewsItems: (breakNewsItems: BreakNewsItem[]) => void;
  selectedBreakNewsItem: BreakNewsItem | null;
  lastUpdatedTimestamp: string;
  setSelectedBreakNewsItem: (riskMetricsItem: BreakNewsItem | null) => void;
  loadBreakNews: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  startPolling: () => void;
}

export const useBreakNewsDataStore = create<BreakNewsDataState>((set, get) => ({
  breakNewsItems: [],
  selectedBreakNewsItem: null,
  lastUpdatedTimestamp: '',
  isLoading: false,
  error: null,

  setBreakNewsItems: (breakNewsItems) => set({ breakNewsItems }),
  setSelectedBreakNewsItem: (selectedBreakNewsItem) => set({ selectedBreakNewsItem: selectedBreakNewsItem }),

  loadBreakNews: async () => {
    set({ isLoading: true, error: null });


    try {
      const result = await breakNewsDataService.getBreakNews();
      set({
        breakNewsItems: result.data.records,
        lastUpdatedTimestamp: '',
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading risk metrics:', error);
      set({ error: 'Failed to load risk metrics.', isLoading: false });
    }
  },

  startPolling: () => {
    setInterval(async () => {
      const prevTimestamp = get().lastUpdatedTimestamp;

      await get().loadBreakNews();

      // Ensure we fetch the latest timestamp after the state is updated
      set((state) => {
        if (state.lastUpdatedTimestamp && state.lastUpdatedTimestamp !== prevTimestamp) {
          useUnseenItemsStore.getState().addUnseenItems(resourceName, 1);
        }
        return {}; // No need to modify state, just ensuring correctness
      });
    }, 120000); // Polls every 2 minutes
  }
}));

// Initial Load and Start Polling
const { loadBreakNews, startPolling } = useBreakNewsDataStore.getState();
loadBreakNews();
startPolling();
