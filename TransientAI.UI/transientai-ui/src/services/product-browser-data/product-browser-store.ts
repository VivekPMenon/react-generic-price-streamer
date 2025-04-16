import { create } from 'zustand';

import {
    BondInfo,
    ClientTrade,
    RecommendedBondInHolding,
    RecommendedClient
} from "@/services/product-browser-data/model";
import {productBrowserDataService} from "@/services/product-browser-data/product-browser-data-service";
import {marketDataService, TraceData} from "@/services/market-data";

export interface ProductBrowserStore {
    isAxesLoading: boolean;
    axes: BondInfo[];
    loadAxes: () => Promise<void>;

    selectedBond: BondInfo|null;
    setSelectedBond: (bondInfo: BondInfo|null) => void;

    selectedClient: string|null;
    setSelectedClient: (client: string|null) => void;

    isRecommendedClientsLoading: boolean;
    recommendedClients: RecommendedClient[];
    loadRecommendedClients(bond: BondInfo|null): Promise<void>;

    isRecommendedClientsWithBondsLoading: boolean;
    recommendedClientsWithBonds: RecommendedClient[];
    loadRecommendedClientsWithBonds(bond: BondInfo|null): Promise<void>;

    isSimilarBondsLoading: boolean;
    similarBonds: RecommendedBondInHolding[];
    loadSimilarBondsInHoldings(bond: BondInfo|null, client_name: string|null): Promise<void>;

    isTradesForBondLoading: boolean;
    bondTrades: ClientTrade[];
    loadTradesForBonds(bond: BondInfo|null): Promise<void>;

    isClientTradesForBondLoading: boolean;
    clientTrades: ClientTrade[];
    loadClientTrades(bond: BondInfo|null, client_name: string|null): Promise<void>;

    isTraceLoading: boolean;
    traces: TraceData[],
    loadTraces: (isin?: string) => Promise<void>;
}

export const useProductBrowserStore = create<ProductBrowserStore>((set, get) => ({
    isAxesLoading: false,
    axes: [],
    loadAxes: async () => {
        try {
            set({ isAxesLoading: true });
            const data = await productBrowserDataService.getTodaysAxes();

            const random = Math.floor(Math.random() * data.length);
            data[random].is_golden = true;

            set({ axes: data });

        } finally {
            set({ isAxesLoading: false });
        }
    },

    selectedBond: null,
    setSelectedBond: (bond: BondInfo|null) => {
        set({ selectedBond: bond, selectedClient: null });
        const state = get();
        state.loadTradesForBonds(bond);
        state.loadRecommendedClients(bond);
        state.loadRecommendedClientsWithBonds(bond);
        state.loadTraces(bond?.isin);
        state.setSelectedClient(null);
    },

    selectedClient: null,
    setSelectedClient: (client: string|null) => {
        const state = get();
        const selectedClient = state.selectedBond ? client : null;
        set({ selectedClient: selectedClient });
        state.loadClientTrades(state.selectedBond, client);
        state.loadSimilarBondsInHoldings(state.selectedBond, client);
    },

    isRecommendedClientsLoading: false,
    recommendedClients: [],
    loadRecommendedClients: async (bond: BondInfo|null) => {
        try {
            set({ isRecommendedClientsLoading: true });
            if (bond) {
                const data = await productBrowserDataService.getRecommendedClients(bond);
                set({recommendedClients: data});
            } else {
                set({recommendedClients: []});
            }

        } finally {
            set({ isRecommendedClientsLoading: false });
        }
    },

    isRecommendedClientsWithBondsLoading: false,
    recommendedClientsWithBonds: [],
    loadRecommendedClientsWithBonds: async (bond: BondInfo|null) => {
        try {
            set({ isRecommendedClientsLoading: true });
            if (bond) {
                const data = await productBrowserDataService.getRecommendedClientsWithBonds(bond);
                set({recommendedClientsWithBonds: data});
            } else {
                set({recommendedClientsWithBonds: []});
            }

        } finally {
            set({ isRecommendedClientsLoading: false });
        }
    },

    isSimilarBondsLoading: false,
    similarBonds: [],
    loadSimilarBondsInHoldings: async (bond: BondInfo|null, client_name: string|null) => {
        try {
            set({ isSimilarBondsLoading: true });
            if (bond && client_name) {
                const data = await productBrowserDataService.getSimilarBondsInHoldings(bond, client_name);
                set({similarBonds: data});
            } else {
                set({similarBonds: []});
            }
        } finally {
            set({ isSimilarBondsLoading: false });
        }
    },

    isTradesForBondLoading: false,
    bondTrades: [],
    loadTradesForBonds: async (bond: BondInfo|null) => {
        try {
            set({ isTradesForBondLoading: true });
            if (bond) {
                const data = await productBrowserDataService.getTradesByBond(bond);
                set({bondTrades: data});
            } else {
                set({bondTrades: []});
            }

        } finally {
            set({ isTradesForBondLoading: false });
        }
    },

    isClientTradesForBondLoading: false,
    clientTrades: [],
    loadClientTrades: async (bond: BondInfo|null, client_name: string|null) => {
        try {
            set({ isClientTradesForBondLoading: true });
            if (bond && client_name) {
                const data = await productBrowserDataService.getClientTradesByBond(bond, client_name);
                set({ clientTrades: data });
            } else {
                set({clientTrades: []});
            }

        } finally {
            set({ isClientTradesForBondLoading: false });
        }
    },

    isTraceLoading: false,
    traces: [],
    loadTraces: async (isin?: string) => {
        try {
            set({ isTraceLoading: true });
            const data = await marketDataService.getTraces(isin);
            set({ traces: data });

        } finally {
            set({ isTraceLoading: false });
        }
    }
}));