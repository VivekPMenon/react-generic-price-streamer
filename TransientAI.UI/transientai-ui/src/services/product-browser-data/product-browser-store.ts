import { create } from 'zustand';

import {BondInfo} from "@/services/product-browser-data/model";
import {productBrowserDataService} from "@/services/product-browser-data/product-browser-data-service";

export interface ProductBrowserStore {
    isTodaysAxesLoading: boolean;
    todaysAxes: BondInfo[];
    loadTodaysAxes: () => Promise<void>;
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
    }
}));

const { loadTodaysAxes } = useProductBrowserStore.getState();
loadTodaysAxes();