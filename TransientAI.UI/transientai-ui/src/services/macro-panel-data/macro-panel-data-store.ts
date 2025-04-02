import { create } from 'zustand';
import {BloombergEmailReport, CryptoCurrency, EquityFuture, FxRate, TreasuryYield} from './model';
import { macroPanelDataService } from './macro-panel-data-service';
import {useUnseenItemsStore} from "@/services/unseen-items-store/unseen-items-store";

export const resourceName = 'bloomberg-email-reports';

const REFRESH_INTERVAL = 60000;
const BBG_REFRESH_INTERVAL = 1200000;
let lastRefreshMillis: number = 0;

interface MacroPanelDataState {
  bloombergEmailReports: BloombergEmailReport[];
  treasuryYields: TreasuryYield[];
  fxRates: FxRate[];
  cryptos: CryptoCurrency[];
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
  loadMacroPanelData: (showLoading: boolean, loadBloombergReports: boolean) => void,
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
  lastRefreshMillis: 0,

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

  loadMacroPanelData: (showLoading: boolean, loadBloombergReports: boolean) => {
    if (showLoading) {
      set({
        isTreasuryLoading: true,
        isFxLoading: true,
        isCryptoLoading: true,
        isEquityFuturesLoading: true
      });
    }

    const now = new Date();
    Promise.allSettled([
      macroPanelDataService.getTreasuryYields(),
      macroPanelDataService.getForeignTreasuryYields()
    ])
        .then(results => {
          const yields: [Date | null, TreasuryYield[]][] = results
              .map(result => result.status === 'fulfilled'
                  ? [result.value[0] as Date | null, result.value[1] as TreasuryYield[]]
                  : [now, [] as TreasuryYield[]]);
          const [date, treasuries] = yields[0];
          const [, foreign] = yields[1];
          return set({
            reportGenerationDate: date,
            treasuryYields: treasuries.concat(foreign)}
          );
        })
        .catch(() => console.error('Error treasury yields rates'))
        .finally(() => set({isTreasuryLoading: false}));
    macroPanelDataService.getFxRates()
        .then(values => set({fxRates: values as FxRate[]}))
        .catch(() => console.error('Error fx rates'))
        .finally(() => set({isFxLoading: false}));
    macroPanelDataService.getCryptos()
        .then(values => set({cryptos: values as CryptoCurrency[]}))
        .catch(() => console.error('Error cryptos'))
        .finally(() => set({isCryptoLoading: false}));
    macroPanelDataService.getGlobalEquityFutures()
        .then(values => set({equityFutures: values as EquityFuture[]}))
        .catch(() => console.error('Error equity futures'))
        .finally(() => set({isEquityFuturesLoading: false}));

    if (loadBloombergReports) {
      const prevCount = get().bloombergEmailReports.length;
      macroPanelDataService.getBloombergReportEmails()
          .then(values => {
            // Use Zustand's `set` function to ensure the correct state is retrieved
            set(() => {
              const newCount = values.length;
              const unseenDiff = Math.abs(newCount - prevCount);

              if (unseenDiff > 0) {
                useUnseenItemsStore.getState().addUnseenItems(resourceName, unseenDiff);
              }

              return { bloombergEmailReports: values }; // No need to modify state here, just ensuring correctness
            });
          })
          .catch(() => console.error('Error bloomberg email reports'))
          .finally(() => set({isLoading: false}));
    }
  },

  startPolling: () => {
    setInterval(async () => {
      lastRefreshMillis += REFRESH_INTERVAL;
      if (lastRefreshMillis === Number.MAX_SAFE_INTEGER) {
        lastRefreshMillis = REFRESH_INTERVAL;
      }
      const {loadMacroPanelData} = get();

      const loadBloombergReports = lastRefreshMillis % BBG_REFRESH_INTERVAL === 0;
      loadMacroPanelData(false, loadBloombergReports);

    }, REFRESH_INTERVAL);
  },

}));

const { loadMacroPanelData, startPolling } = useMacroPanelDataStore.getState();
loadMacroPanelData(true, true);
startPolling();

