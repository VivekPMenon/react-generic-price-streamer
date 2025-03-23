import { create } from 'zustand';
import {BloombergEmailReport, FxRate, TreasuryYield} from './model';
import { macroPanelDataService } from './macro-panel-data-service';
import {useUnseenItemsStore} from "@/services/unseen-items-store/unseen-items-store";

export const resourceName = 'bloomberg-email-reports';

interface MacroPanelDataState {
  bloombergEmailReports: BloombergEmailReport[];
  treasuryYields: TreasuryYield[];
  fxRates: FxRate[];
  cryptos: Crypto[];
  isLoading: boolean;
  loadBloombergEmailReports: () => Promise<void>;
  selectedReport?: BloombergEmailReport;
  setSelectedReport: (report: BloombergEmailReport) => void;
  loadMacroPanelData: () => Promise<void>,
  startPolling: () => void;
}

export const useMacroPanelDataStore = create<MacroPanelDataState>((set, get) => ({
  bloombergEmailReports: [],
  treasuryYields: [],
  fxRates: [],
  cryptos: [],
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

  loadMacroPanelData: async () => {
    set({ isLoading: true });

    try {
      const results = await Promise.allSettled([
        macroPanelDataService.getTreasuryYields(),
        macroPanelDataService.getFxRates(),
        macroPanelDataService.getCryptos(),
      ]);
      const values = results.map(result => result.status === 'fulfilled' ? result.value : []);

      set({
        treasuryYields: values[0] as TreasuryYield[],
        fxRates: values[1] as FxRate[],
        cryptos: values[2] as Crypto[]
      });

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
      const {bloombergEmailReports} = get();

      const prevCount = bloombergEmailReports.length;

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

const { loadMacroPanelData, startPolling } = useMacroPanelDataStore.getState();
loadMacroPanelData();
startPolling();

