import { create } from 'zustand';
import { pmsPnlPanelDataService } from './pms-pnl-data-service';
import {ReportItem} from "@/services/pms-pnl-data/model";
import {parseIsoDate} from "@/lib/utility-functions/date-operations";

// export const resourceName = 'pms-pnl-report';

interface PmsPnlDataState {
  isLoading: boolean;
  report: [ReportItem[], ReportItem|null]|null;
  reportDate: Date|null;
  getReport: () => void;
}

export const usePmsPnlDataStore = create<PmsPnlDataState>((set) => ({
  isLoading: false,
  report: null,
  reportDate: null,

  getReport: () => {
    set({ isLoading: true });

    pmsPnlPanelDataService.getReport()
        .then(result => {
            if (result) {
                set({
                    report: [result[0].data, result[1]],
                    reportDate: parseIsoDate(result[0].last_updated) || new Date()
                })
            }
        })
        .catch(err => console.error(err))
        .finally(() => set({ isLoading: false }));
  }
}));

const { getReport } = usePmsPnlDataStore.getState();
getReport();

