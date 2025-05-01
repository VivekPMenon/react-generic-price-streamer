import { create } from 'zustand';
import {createSelectors} from "@/lib/utility-functions/store-operations";

interface UnseenItemsState {
  unseenItems: Record<string, number>;
  addUnseenItems: (storeId: string, count: number) => void;
  resetUnseenItems: (storeId: string) => void;
}

const useUnseenItemsStore = create<UnseenItemsState>((set) => ({
  unseenItems: {},

  addUnseenItems: (storeId, count) => {
      set((state) => {
          const newCount = (state.unseenItems[storeId] || 0) + count;
          return ({
              unseenItems: {
                  ...state.unseenItems,
                  [storeId]: Math.max(newCount, 0)
              }
          });
      })
  },

  resetUnseenItems: (storeId) => {
      set((state) => ({
          unseenItems: {
              ...state.unseenItems,
              [storeId]: 0
          }
      }))
  }
}));

export const unseenItemsStore = createSelectors(useUnseenItemsStore);
