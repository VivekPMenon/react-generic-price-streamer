import { create } from 'zustand';

import {BondInfo, RecommendedClient} from "@/services/product-browser-data/model";
import {productBrowserDataService} from "@/services/product-browser-data/product-browser-data-service";

export interface ProductBrowserStore {
    isTodaysAxesLoading: boolean;
    todaysAxes: BondInfo[];
    loadTodaysAxes: () => Promise<void>;

    isRecommendedClientsLoading: boolean;
    recommendedClients: RecommendedClient[];
    loadRecommendedClients(bond: BondInfo): Promise<void>;

    isRecommendedClientsWithBondsLoading: boolean;
    recommendedClientsWithBonds: BondInfo[];
    loadRecommendedClientsWithBonds(bond: BondInfo): Promise<void>;

    isSimilarBondsLoading: boolean;
    similarBonds: BondInfo[];
    loadSimilarBondsInHoldings(bond: BondInfo, client_name: string): Promise<void>;

    isTradesForBondLoading: boolean;
    bondTrades: BondInfo[];
    loadTradesForBonds(bond: BondInfo): Promise<void>;

    isClientTradesForBondLoading: boolean;
    clientTrades: BondInfo[];
    loadClientTrades(bond: BondInfo, client_name: string): Promise<void>;
}

export const useProductBrowserStore = create<ProductBrowserStore>((set) => ({
    isTodaysAxesLoading: false,
    todaysAxes: [],
    loadTodaysAxes: async () => {
        try {
            set({ isTodaysAxesLoading: true });
            const data = await productBrowserDataService.getTodaysAxes();

            const random = Math.floor(Math.random() * data.length);
            data[random].is_golden = true;

            set({ todaysAxes: data });

        } finally {
            set({ isTodaysAxesLoading: false });
        }
    },

    isRecommendedClientsLoading: false,
    recommendedClients: [],
    loadRecommendedClients: async (bond: BondInfo) => {
        try {
            set({ isRecommendedClientsLoading: true });
            const data = await productBrowserDataService.getRecommendedClients(bond);

            set({ recommendedClients: data });

        } finally {
            set({ isRecommendedClientsLoading: false });
        }
    },

    isRecommendedClientsWithBondsLoading: false,
    recommendedClientsWithBonds: [],
    loadRecommendedClientsWithBonds: async (bond: BondInfo) => {
        try {
            set({ isRecommendedClientsLoading: true });
            const data = await productBrowserDataService.getRecommendedClientsWithBonds(bond);

            set({ recommendedClientsWithBonds: data });

        } finally {
            set({ isRecommendedClientsLoading: false });
        }
    },

    isSimilarBondsLoading: false,
    similarBonds: [],
    loadSimilarBondsInHoldings: async (bond: BondInfo, client_name: string) => {
        try {
            set({ isSimilarBondsLoading: true });
            const data = await productBrowserDataService.getSimilarBondsInHoldings(bond, client_name);

            set({ similarBonds: data });

        } finally {
            set({ isSimilarBondsLoading: false });
        }
    },

    isTradesForBondLoading: false,
    bondTrades: [],
    loadTradesForBonds: async (bond: BondInfo) => {
        try {
            set({ isTradesForBondLoading: true });
            const data = await productBrowserDataService.getTradesByBond(bond);

            set({ bondTrades: data });

        } finally {
            set({ isTradesForBondLoading: false });
        }
    },

    isClientTradesForBondLoading: false,
    clientTrades: [],
    loadClientTrades: async (bond: BondInfo, client_name: string) => {
        try {
            set({ isClientTradesForBondLoading: true });
            const data = await productBrowserDataService.getClientTradesByBond(bond, client_name);

            set({ clientTrades: data });

        } finally {
            set({ isClientTradesForBondLoading: false });
        }
    }
}));