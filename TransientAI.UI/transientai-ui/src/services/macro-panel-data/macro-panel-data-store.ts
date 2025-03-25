import { create } from 'zustand';
import {BloombergEmailReport, EquityFuture, FxRate, TreasuryYield} from './model';
import { macroPanelDataService } from './macro-panel-data-service';
import {useUnseenItemsStore} from "@/services/unseen-items-store/unseen-items-store";

export const resourceName = 'bloomberg-email-reports';

interface MacroPanelDataState {
  bloombergEmailReports: BloombergEmailReport[];
  treasuryYields: TreasuryYield[];
  fxRates: FxRate[];
  cryptos: Crypto[];
  equityFutures: EquityFuture[];
  reportGenerationDate: Date|null;
  isLoading: boolean;
  isTreasuryLoading: boolean;
  isFxLoading: boolean;
  isCryptoLoading: boolean;
  isEquityFuturesLoading: boolean;
  loadBloombergEmailReports: () => Promise<void>;
  selectedReport?: BloombergEmailReport;
  setSelectedReport: (report: BloombergEmailReport) => void;
  loadMacroPanelData: () => void,
  startPolling: () => void;
}

export const useMacroPanelDataStore = create<MacroPanelDataState>((set, get) => ({
  bloombergEmailReports: [],
  treasuryYields: [],
  fxRates: [],
  cryptos: [],
  equityFutures: [],
  isLoading: false,
  isTreasuryLoading: false,
  isFxLoading: false,
  isCryptoLoading: false,
  isEquityFuturesLoading: false,
  reportGenerationDate: null,

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

  loadMacroPanelData: () => {
    set({
      isTreasuryLoading: true,
      isFxLoading: true,
      isCryptoLoading: true,
      isEquityFuturesLoading: true
    });
    macroPanelDataService.getTreasuryYields()
        .then(values => set({
          reportGenerationDate: values[0], treasuryYields: values[1] as TreasuryYield[]
        }))
        .catch(() => console.error('Error treasury yields'))
        .finally(() => set({ isTreasuryLoading: false }));
    macroPanelDataService.getFxRates()
        .then(values => set({fxRates: values as FxRate[]}))
        .catch(() => console.error('Error fx rates'))
        .finally(() => set({ isFxLoading: false }));
    macroPanelDataService.getCryptos()
        .then(values => set({cryptos: values as Crypto[]}))
        .catch(() => console.error('Error cryptos'))
        .finally(() => set({ isCryptoLoading: false }));
    macroPanelDataService.getGlobalEquityFutures()
        .then(values => set({ equityFutures: values as EquityFuture[]}))
        .catch(() => console.error('Error equity futures'))
        .finally(() => set({ isEquityFuturesLoading: false }));
    macroPanelDataService.getBloombergReportEmails()
        .then(values => set({ bloombergEmailReports: values }))
        .catch(() => console.error('Error bloomberge email reports'))
        .finally(() => set({ isLoading: false }));
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

