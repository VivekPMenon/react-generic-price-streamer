import { create } from 'zustand';
import { BreakNewsItem } from './model';
import { breakNewsDataService } from './break-news-data-service';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';

export const resourceName = 'break-news';
export interface BreakNewsDataState {
  breakNewsItems: BreakNewsItem[];
  setBreakNewsItems: (breakNewsItems: BreakNewsItem[]) => void;
  selectedBreakNewsItem: BreakNewsItem | null;
  lastUpdatedTimestamp: string;
  setSelectedBreakNewsItem: (breakNewsItem: BreakNewsItem | null) => void;
  loadBreakNews: () => Promise<void>;
  setGroupId: (groupId: string | number | null) => void;
  selectedGroupId: string | number | null;
  isLoading: boolean;
  error: string | null;
  startPolling: () => void;
}

export const useBreakNewsDataStore = create<BreakNewsDataState>((set, get) => ({
  breakNewsItems: [],
  selectedBreakNewsItem: null,
  lastUpdatedTimestamp: '',
  selectedGroupId: null,
  isLoading: false,
  error: null,

  setBreakNewsItems: (breakNewsItems) => set({ breakNewsItems }),
  setSelectedBreakNewsItem: (selectedBreakNewsItem) => set({ selectedBreakNewsItem }),
  setGroupId: (groupId) => set({ selectedGroupId: groupId }),
  loadBreakNews: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await breakNewsDataService.getBreakNews(); // Fetch data
      set({
        breakNewsItems: result.data.unread_messages, // Store translated messages
        lastUpdatedTimestamp: '',
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading break news:', error);
      set({ error: 'Failed to load break news.', isLoading: false });
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
    }, 60000); // Poll every minute
  },
}));

// Initial Load and Start Polling
const { loadBreakNews, startPolling } = useBreakNewsDataStore.getState();
loadBreakNews();
startPolling();
