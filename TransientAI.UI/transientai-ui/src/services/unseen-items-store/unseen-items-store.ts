import { create } from 'zustand';
import {executeAsync} from "@/lib/utility-functions/async";

interface UnseenItemsState {
  unseenItems: Record<string, number>;
  addUnseenItems: (storeId: string, count: number) => void;
  resetUnseenItems: (storeId: string) => void;
}

export const useUnseenItemsStore = create<UnseenItemsState>((set) => ({
  unseenItems: {},

  addUnseenItems: (storeId, count) =>
    set((state) => ({
      unseenItems: {
        ...state.unseenItems,
        [storeId]: (state.unseenItems[storeId] || 0) + count
      }
    })),

  resetUnseenItems: (storeId) => {
      executeAsync(() =>
      set((state) => ({
          unseenItems: {
              ...state.unseenItems,
              [storeId]: 0
          }
      })), 5000);
  }
}));
