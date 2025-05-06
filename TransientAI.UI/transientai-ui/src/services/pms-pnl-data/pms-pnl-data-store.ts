import { create } from 'zustand';
import { pmsPnlPanelDataService } from './pms-pnl-data-service';
import {Report, ReportItem} from "@/services/pms-pnl-data/model";
import {parseLocalDate} from "@/lib/utility-functions/date-operations";
import { createSelectors } from '@/lib/utility-functions/store-operations';

interface PmsPnlDataState {
  isLoading: boolean;
  report: Report|null;
  reportDate: Date|null;
  filteredReport: ReportItem[] | null;

  getReport: () => void;
  getColumnDefs: () => void;
}

const usePmsPnlDataStore = create<PmsPnlDataState>((set, get) => ({
  isLoading: false,
  report: null,
  reportDate: null,
  filteredReport: null,

  getReport: () => {
    set({ isLoading: true });
    pmsPnlPanelDataService.getReport()
        .then(result => {
            if (result) {
                set({
                    report: result,
                    reportDate: parseLocalDate(result.last_updated) || new Date(),
                    filteredReport: result.data.filter((report)=> report.manager.includes('S2_C'))
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
    },

    getColumnDefs: async () => {
        try {
            const result = pmsPnlPanelDataService.getColumnDefs();
            return result;
        } catch (error: any) {
            console.error(error);
        }  
    }
}));

export const pmsPnlDataStore = createSelectors(usePmsPnlDataStore);