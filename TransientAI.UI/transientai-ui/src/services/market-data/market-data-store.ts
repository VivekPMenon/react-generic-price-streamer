import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {FinancialData, ImageType, Instrument, PeriodType} from "@/services/market-data/model";
import {marketDataService} from "@/services/market-data/market-data-service";
import {MarketDataType} from "@/services/macro-panel-data/model";

export interface MarketDataStore {
    tickers: string[];
    instruments: Instrument[];
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string;
    clearAllInstruments: () => void;
    findInstrument: (company_or_ticker: string, period: PeriodType, manageLoadingExternally: boolean) => void;
    removeInstrument: (instrument: Instrument) => void;
    getInstrumentLogoUrl: (instrument: Instrument, format: ImageType, size: number) => string;
    maxInstruments: boolean;
    loadInstrument: (company_or_ticker: string, type: MarketDataType|undefined, period: PeriodType, includeFinancials: boolean) => Promise<Instrument|null>;
}

const MAX_INSTRUMENTS = 5;
const REFRESH_INTERVAL = 30000;
const MAX_INSTRUMENTS_REACHED = `Limit of ${MAX_INSTRUMENTS} charts, please delete some to proceed`;

export const useMarketDataStore = create<MarketDataStore>()(
    persist((set, get) => ({
        tickers: [],
        instruments: [],
        isLoading: false,
        error: '',
        maxInstruments: false,
        setIsLoading: (isLoading: boolean) => set({isLoading}),
        clearAllInstruments: () => {
            get().instruments.forEach((instrument: Instrument) => {
                if (instrument.dispose) {
                    instrument.dispose();
                }
            });
            set({instruments: [], isLoading: false, maxInstruments: false, error: ''});
        },
        loadInstrument: async (company_or_ticker: string, type: MarketDataType|undefined, period: PeriodType, includeFinancials: boolean) => {
            const promises: Promise<any>[] = [
                marketDataService.getMarketData(company_or_ticker, period, type)
            ];

            if (includeFinancials) {
                promises.push(marketDataService.getFinancialData(company_or_ticker));
            }

            const results = (await Promise.allSettled(promises))
                .map(result => result.status === 'fulfilled' ? result.value : null);

            const instrument = results[0] as Instrument;
            if (!instrument) {
                return null;
            }

            if (includeFinancials) {
                instrument.financials = results[1] as FinancialData;
            }

            return instrument;
        },
        findInstrument: async (company_or_ticker: string, period: PeriodType = PeriodType.ONE_YEAR, manageLoadingExternally: boolean = false) => {
            const search = company_or_ticker.toUpperCase();
            try {
                if (!manageLoadingExternally) {
                    set({isLoading: true});
                }

                if (get().maxInstruments) {
                    set({error: MAX_INSTRUMENTS_REACHED});
                    return;
                }

                const instruments = get().instruments;
                const index = instruments.findIndex(instrument => instrument.ticker.toUpperCase() === search);
                if (index >= 0) {
                    set({error: `${search} already found`});
                    return;
                }

                const instrument = await get().loadInstrument(search, undefined, period, true);
                if (!instrument) {
                    set({error: `Could not find ${search}`});
                    return;
                }
                instruments.unshift(instrument);

                const timeout = setInterval(async () => {
                    const {instruments: currentInstruments, loadInstrument} = get();
                    const index = currentInstruments
                        .findIndex(i => instrument.ticker.toUpperCase() === i.ticker.toUpperCase());

                    if (index >= 0) {
                        const refreshed = await loadInstrument(instrument.ticker, undefined, period, false);
                        if (refreshed) {
                            refreshed.dispose = instrument.dispose;
                            refreshed.financials = instrument.financials;
                            currentInstruments[index] = refreshed;
                            set({instruments: [...currentInstruments], maxInstruments: instruments.length >= MAX_INSTRUMENTS});
                            return;
                        }
                    }
                    clearInterval(timeout);
                }, REFRESH_INTERVAL);

                instrument.dispose = () => clearInterval(timeout);

                set({instruments: [...instruments], error: '', maxInstruments: instruments.length >= MAX_INSTRUMENTS});

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
                const removed = copy.splice(index, 1);
                removed.forEach((instrument: Instrument) => {
                    if (instrument.dispose) {
                        instrument.dispose();
                    }
                });
                set({instruments: [...copy], error: '', maxInstruments: copy.length >= MAX_INSTRUMENTS});
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
                      const unique = Array.from(new Set(tickers)).slice(0, MAX_INSTRUMENTS);
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