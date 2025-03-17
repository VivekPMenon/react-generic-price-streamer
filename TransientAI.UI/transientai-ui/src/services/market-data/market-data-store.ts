import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {ImageType, Instrument, PeriodType} from "@/services/market-data/model";
import {marketDataService} from "@/services/market-data/market-data-service";

export interface MarketDataStore {
    tickers: string[];
    instruments: Instrument[];
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string;
    findInstrument: (company_or_ticker: string, period: PeriodType, manageLoadingExternally: boolean) => void;
    removeInstrument: (instrument: Instrument) => void;
    getInstrumentLogoUrl: (instrument: Instrument, format: ImageType, size: number) => string;
}

export const useMarketDataStore = create<MarketDataStore>()(
    persist((set, get) => ({
        tickers: [],
        instruments: [],
        isLoading: false,
        error: '',

        setIsLoading: (isLoading: boolean) => set({isLoading}),
        findInstrument: async (company_or_ticker: string, period: PeriodType = PeriodType.ONE_YEAR, manageLoadingExternally: boolean = false) => {
            const search = company_or_ticker.toUpperCase();
            try {
                if (!manageLoadingExternally) {
                    set({isLoading: true});
                }

                const instruments = get().instruments;
                const index = instruments.findIndex(instrument => instrument.ticker.toUpperCase() === search);
                if (index >= 0) {
                    return
                }

                const instrument = await marketDataService.getMarketData(search, period);
                if (!instrument) {
                    set({error: `Could not find ${search}`});
                    return;
                }

                await marketDataService.getFinancialData(instrument.ticker)
                    .then(value => instrument.financials = value)

                instruments.unshift(instrument);

                set({instruments: instruments, error: ''});

            } catch (e: any) {
                set({error: `Could not find ${search}`});
            } finally {
                if (!manageLoadingExternally) {
                    set({isLoading: false});
                }
            }
        },

        removeInstrument: (instrument: Instrument) => {
            const {ticker} = instrument;
            const instruments = get().instruments;
            const index = instruments.findIndex(instrument => instrument.ticker === ticker);
            if (index >= 0) {
                const copy = [...instruments];
                copy.splice(index, 1);
                set({instruments: [...copy]});
            }
        },

        getInstrumentLogoUrl: (instrument: Instrument, format: ImageType = ImageType.SVG, size: number = 100) => {
            return marketDataService.getLogoUrl(instrument.ticker, format, size);
        }
    }), {
      name: 'market-data-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        tickers: state.instruments.map(instrument => instrument.ticker)
      }),
      onRehydrateStorage: () => {
          return async (state, error) => {
              if (!error && state) {
                  const tickers = state?.tickers;
                  if (tickers && tickers.length) {
                      const unique = new Set(state.tickers)
                      state.setIsLoading(true);
                      Promise
                          .allSettled([...unique]
                          .map((ticker: string) => state.findInstrument(ticker, PeriodType.ONE_YEAR, true)))
                          .finally(() => state.setIsLoading(false));
                  }
              }
          }
      },
    })
);