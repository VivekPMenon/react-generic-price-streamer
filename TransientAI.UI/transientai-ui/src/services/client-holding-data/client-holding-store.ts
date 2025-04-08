import { create } from 'zustand';
import {ClientHolding, BondTrade} from "@/services/client-holding-data/model";
import {clientHoldingsDataService} from "@/services/client-holding-data/client-holding-data-service";

export interface ClientHoldingStore {
    isClientHoldingsLoading: boolean;
    clientHoldings: ClientHolding[];
    loadClientHoldings: (isin?: string) => Promise<void>;
    isBondTradesLoading: boolean;
    bondTrades: BondTrade[];
    loadBondTrades: (security?: string) => Promise<void>;
    error: string;
}

export const useClientHoldingsStore = create<ClientHoldingStore>((set, get) => ({
    isClientHoldingsLoading: false,
    clientHoldings: [],
    isBondTradesLoading: false,
    bondTrades: [],
    error: '',

    loadClientHoldings: async (isin?: string) => {
        try {
            set({ isClientHoldingsLoading: true });
            const clientHoldings = await clientHoldingsDataService.getClientHoldings(isin);

            set({ clientHoldings });
        } catch (e: any) {
            set({ clientHoldings: [], error: 'Failed to load client holdings' });
        } finally {
            set({ isClientHoldingsLoading: false });
        }
    },

    loadBondTrades: async (security?: string) => {
        try {
            set({ isBondTradesLoading: true });
            const bondTrades = await clientHoldingsDataService.getTradingActivity(security);

            set({ bondTrades });
        } catch (e: any) {
            set({ bondTrades: [], error: 'Failed to load client holdings' });
        } finally {
            set({ isBondTradesLoading: false });
        }
    }
}));

const { loadClientHoldings, loadBondTrades } = useClientHoldingsStore.getState();
loadClientHoldings();
loadBondTrades();