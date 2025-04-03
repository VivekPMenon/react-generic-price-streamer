import { create } from 'zustand';
import { pmsPnlPanelDataService } from './pms-pnl-data-service';
import {ReportItem} from "@/services/pms-pnl-data/model";

// export const resourceName = 'pms-pnl-report';

interface PmsPnlDataState {
  isLoading: boolean;
  report: [ReportItem[], ReportItem]|null;
  reportDate: Date;
  getReport: () => void;
}

export const usePmsPnlDataStore = create<PmsPnlDataState>((set) => ({
  isLoading: false,
  report: null,
  reportDate: new Date(),

  getReport: () => {
    set({ isLoading: true });

    pmsPnlPanelDataService.getReport()
        .then(result => {
            if (result) {
                set({
                    report: [result[0].data, result[1]],
                    reportDate: new Date(result[0].last_updated)
                })
            }
        })
        .catch(err => console.error(err))
        .finally(() => set({ isLoading: false }));
  }
}));

const { getReport } = usePmsPnlDataStore.getState();
getReport();

