import { create } from 'zustand';
import { pmsPnlPanelDataService } from './pms-pnl-data-service';
import {ReportItem} from "@/services/pms-pnl-data/model";
import {parseLocalDate} from "@/lib/utility-functions/date-operations";

interface PmsPnlDataState {
  isLoading: boolean;
  report: [ReportItem[], ReportItem|null]|null;
  reportDate: Date|null;
  getReport: () => void;
  startPolling: () => void;
}

export const usePmsPnlDataStore = create<PmsPnlDataState>((set, get) => ({
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
                    reportDate: parseLocalDate(result[0].last_updated) || new Date()
                })
            }
        })
        .catch(err => console.error(err))
        .finally(() => set({ isLoading: false }));
  },

    startPolling: () => {
        setInterval(() => {
            get().getReport();
        }, 3600000); // Polls every hour
    }
}));

const { getReport, startPolling } = usePmsPnlDataStore.getState();
getReport();
startPolling();
