import { create } from 'zustand';

interface UnseenItemsState {
  unseenItems: Record<string, number>;
  addUnseenItems: (storeId: string, count: number) => void;
  resetUnseenItems: (storeId: string) => void;
}

export const useUnseenItemsStore = create<UnseenItemsState>((set) => ({
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
