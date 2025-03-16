import { create } from 'zustand';
import { BloombergEmailReport } from './model';
import { macroPanelDataService } from './macro-panel-data-service';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';

export const resourceName = 'bloomberg-email-reports';

interface MacroPanelDataState {
  bloombergEmailReports: BloombergEmailReport[];
  isLoading: boolean;
  loadBloombergEmailReports: () => Promise<void>;
  selectedReport?: BloombergEmailReport;
  setSelectedReport: (report: BloombergEmailReport) => void;
  startPolling: () => void;
}

export const useMacroPanelDataStore = create<MacroPanelDataState>((set, get) => ({
  bloombergEmailReports: [],
  isLoading: false,

  setSelectedReport: (report) => set({ selectedReport: report }),
  loadBloombergEmailReports: async () => {
    set({ isLoading: true });

    try {
      const result = await macroPanelDataService.getBloombergReportEmails();
      set({ bloombergEmailReports: result });
      set({ selectedReport: result[0] });
    } catch (error) {
      console.error('Error loading macro panel data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  startPolling: () => {
    setInterval(async () => {
      const prevCount = get().bloombergEmailReports.length;

      await get().loadBloombergEmailReports;

      // Use Zustand's `set` function to ensure the correct state is retrieved
      set((state) => {
        const newCount = state.bloombergEmailReports.length;
        const unseenDiff = Math.abs(newCount - prevCount);

        if (unseenDiff > 0) {
          useUnseenItemsStore.getState().addUnseenItems(resourceName, unseenDiff);
        }

        return {}; // No need to modify state here, just ensuring correctness
      });
    }, 12000000);
  },
}));

const { loadBloombergEmailReports: loadMacroPanelData, startPolling } = useMacroPanelDataStore.getState();
loadMacroPanelData();
startPolling();

