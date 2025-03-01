import { create } from 'zustand';
import { ResearchReport } from './model';
import { researchReportsDataService } from './research-reports-data';

export interface ResearchReportsState {
  reports: ResearchReport[];
  setReports: (reports: ResearchReport[]) => void;
  selectedReport: ResearchReport | null;
  setSelectedReport: (report: ResearchReport | null) => void;
  loadReports: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useResearchReportsStore = create<ResearchReportsState>((set, get) => ({
  reports: [],
  setReports: (reports) => set({ reports }),
  selectedReport: null,
  setSelectedReport: (report) => set({ selectedReport: report }),
  isLoading: false, 
  error: null, 
  loadReports: async () => {
    set({ isLoading: true, error: null }); // Start loading, reset error
    try {
      const reports = await researchReportsDataService.getReports();
      set({ reports, isLoading: false }); // Data loaded, stop loading
    } catch (error) {
      console.error('Error loading reports:', error);
      set({ error: 'Failed to load reports.', isLoading: false }); // Set error, stop loading
    }
  },
}));

// Immediately call loadReports when the store is initialized.
const { loadReports } = useResearchReportsStore.getState();
loadReports();
