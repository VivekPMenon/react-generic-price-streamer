
import { create } from 'zustand';
import { BreakNewsItem } from './model'
import { adminDashboardDataService } from './admin-dashboard-data-service';
import { unseenItemsStore } from '../unseen-items-store/unseen-items-store';
import {createSelectors} from "@/lib/utility-functions/store-operations";


export const resourceName = 'admin-dashboard';
export interface BreakNewsDataState {
  // breakNewsItems: BreakNewsItem[];
  // setBreakNewsItems: (breakNewsItems: BreakNewsItem[]) => void;
  isLoading: boolean;
  error: string | null;
}

const useBreakNewsDataStore = create<BreakNewsDataState>()((set, get) => ({
  //breakNewsItems: [],
  isLoading: false,
  error: null,
  
  // loadBreakNews: async () => {
  //   set({ isLoading: true, error: null });

  //   try {
  //     const result = await breakNewsDataService.getBreakNews();
  //     set({
  //       breakNewsItems: result.data.unread_messages,
  //       lastUpdatedTimestamp: '',
  //       isLoading: false
  //     });
  //   } catch (error) {
  //     console.error('Error loading risk metrics:', error);
  //     set({ error: 'Failed to load risk metrics.', isLoading: false });
  //   }
  // }
}));

export const breakNewsStore = createSelectors(useBreakNewsDataStore);
