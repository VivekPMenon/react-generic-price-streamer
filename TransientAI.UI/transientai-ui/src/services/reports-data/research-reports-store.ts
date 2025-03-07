import { create } from 'zustand';
import { ResearchReport } from './model';
import { researchReportsDataService } from './research-reports-data';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';

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
      const newReports = await researchReportsDataService.getReports();
      const prevCount = get().reports.length;
      const newCount = newReports.length;
      const unseenDiff = newCount - prevCount;

      set({ reports: newReports, isLoading: false });

      if (unseenDiff > 0) {
        useUnseenItemsStore.getState().addUnseenItems(resourceName, unseenDiff);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      set({ error: 'Failed to load reports.', isLoading: false });
    }
  },

  startPolling: () => {
    setInterval(() => {
      get().loadReports();
    }, 120000); // Polls every 2 minutes
  }
}));

const { loadReports, startPolling } = useResearchReportsStore.getState();
loadReports();
startPolling();
