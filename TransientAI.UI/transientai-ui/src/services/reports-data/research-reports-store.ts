import { create } from 'zustand';
import { ResearchReport } from './model';
import { researchReportsDataService } from './research-reports-data';
import { unseenItemsStore } from '../unseen-items-store/unseen-items-store';
import { areObjectsEqual } from '@/lib/utility-functions';
import { useUserContextStore } from '../user-context';

export const resourceName = 'research-reports';

export interface ResearchReportsState {
  reports: ResearchReport[];
  setReports: (reports: ResearchReport[]) => void;
  selectedReport: ResearchReport | null;
  setSelectedReport: (report: ResearchReport | null) => void;
  loadReports: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  startPolling: () => void;
}

export const useResearchReportsStore = create<ResearchReportsState>((set, get) => ({
  reports: [],
  selectedReport: null,
  isLoading: false,
  error: null,

  setReports: (reports) => set({ reports }),
  setSelectedReport: (report) => set({ selectedReport: report }),

  loadReports: async () => {
    set({ isLoading: true, error: null });

    try {
      const userContext = useUserContextStore.getState().userContext;
      const newReports = await researchReportsDataService.getReports(userContext.userId!);

      set({ reports: newReports, isLoading: false });
    } catch (error) {
      console.error('Error loading reports:', error);
      set({ error: 'Failed to load reports.', isLoading: false });
    }
  },

  startPolling: () => {
    setInterval(async () => {
      const prevCount = get().reports.length;

      const { reports } = get();
      const userContext = useUserContextStore.getState().userContext;
      const newReports = await researchReportsDataService.getReports(userContext.userId!);
      if (areObjectsEqual(reports, newReports)) {
        return;
      }

      set({ reports: newReports });

      // Use Zustand's `set` function to ensure the correct state is retrieved
      set((state) => {
        const newCount = state.reports.length;
        const unseenDiff = Math.abs(newCount - prevCount);

        if (unseenDiff > 0) {
          unseenItemsStore.getState().addUnseenItems(resourceName, unseenDiff);
        }

        return {}; // No need to modify state here, just ensuring correctness
      });
    }, 120000); // Polls every 2 minutes
  }
}));