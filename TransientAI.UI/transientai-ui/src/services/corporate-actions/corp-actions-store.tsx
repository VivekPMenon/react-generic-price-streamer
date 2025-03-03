import { create } from 'zustand';
import {CorporateAction, CorporateActionDetail} from "./model";
import { corpActionsDataService } from './corporate-actions-data';

export interface CorpActionsDataState {
  corpActions: CorporateAction[];
  selectedCorpAction: CorporateAction | null;
  setSelectedCorpAction: (corpAction: CorporateAction | null) => void;
  setCorpActions: (corpActionsData: CorporateAction[]) => void;
  loadCorpActions: () => Promise<void>;
  loadCorpActionDetail: (eventId: string) => Promise<CorporateActionDetail>;
}

export const useCorpActionsStore = create<CorpActionsDataState>((set, get) => ({
  corpActions: [],
  setCorpActions: (corpActions) => set({ corpActions }),
  selectedCorpAction: null,
  setSelectedCorpAction: (corpAction) => set({ selectedCorpAction: corpAction }),
  loadCorpActions: async () => {
    const corpActions = await corpActionsDataService.getCorpActions2();
    set({ corpActions });
  },
  loadCorpActionDetail: async(eventId: string)=> {
    return await corpActionsDataService.getCorpActionDetail(eventId);
  }
}));

const { loadCorpActions } = useCorpActionsStore.getState();
loadCorpActions();