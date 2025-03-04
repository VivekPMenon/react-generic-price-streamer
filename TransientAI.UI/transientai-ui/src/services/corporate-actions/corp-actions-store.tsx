import { create } from 'zustand';
import {CorporateAction} from "./model";
import { corpActionsDataService } from './corporate-actions-data';

export interface CorpActionsDataState {
  corpActions: CorporateAction[];
  selectedCorpAction: CorporateAction | null;
  setSelectedCorpAction: (corpAction: CorporateAction | null) => void;
  setCorpActions: (corpActionsData: CorporateAction[]) => void;
  loadCorpActions: () => Promise<void>;
  loadCorpActionDetail: (eventId: string) => Promise<CorporateAction>;
}

export const useCorpActionsStore = create<CorpActionsDataState>((set) => ({
  corpActions: [],
  setCorpActions: (corpActions) => set({ corpActions }),
  selectedCorpAction: null,
  setSelectedCorpAction: (corpAction) => set({ selectedCorpAction: corpAction }),
  loadCorpActions: async () => {
    const corpActions = await corpActionsDataService.getCorpActions();
    corpActions.sort(
        (a: CorporateAction, b: CorporateAction) => {
          const aDate = a?.dates?.notification_date
              ? new Date(a.dates.notification_date).getTime()
              : -1;
          const bDate = b?.dates?.notification_date
              ? new Date(b.dates.notification_date).getTime()
              : -1;

          return bDate - aDate;
        }

    )
    set({ corpActions });
  },
  loadCorpActionDetail: async(eventId: string)=> {
    return await corpActionsDataService.getCorpActionDetail(eventId);
  }
}));

const { loadCorpActions } = useCorpActionsStore.getState();
loadCorpActions();