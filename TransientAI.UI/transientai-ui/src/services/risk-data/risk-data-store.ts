import { create } from 'zustand';
import { RiskMetricsItem } from './model';
import { riskDataService } from './risk-data-service';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';

export const resourceNameRiskMetrics = 'risk-metrics';

export interface RiskDataState {
  riskMetricsItems: RiskMetricsItem[] | null;
  setRiskMetricsItems: (riskMetricsItems: RiskMetricsItem[]) => void;
  selectedRiskMetricsItem: RiskMetricsItem | null;
  lastUpdatedTimestamp: string;
  setSelectedRiskMetricsItem: (riskMetricsItem: RiskMetricsItem | null) => void;
  loadRiskMetrics: () => Promise<void>;
  riskMetricsItemsFiltered: RiskMetricsItem[] | null;
  isLoading: boolean;
  error: string | null;
  startPolling: () => void;
}

export const useRiskDataStore = create<RiskDataState>((set, get) => ({
  riskMetricsItems: null,
  riskMetricsItemsFiltered: null,
  selectedRiskMetricsItem: null,
  lastUpdatedTimestamp: '',
  isLoading: false,
  error: null,

  setRiskMetricsItems: (riskMetricsItems) => set({ riskMetricsItems }),
  setSelectedRiskMetricsItem: (riskMetricsItem) => set({ selectedRiskMetricsItem: riskMetricsItem }),

  loadRiskMetrics: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await riskDataService.getRiskMetrics();
      set({
        riskMetricsItems: result?.margin_data,
        lastUpdatedTimestamp: result?.timestamp,
        isLoading: false,
        riskMetricsItemsFiltered: result?.margin_data?.filter((data: RiskMetricsItem) => {
          return data.name === 'Chris Napoli' || data.name === 'IBIS_ALL*';
        })
      });
    } catch (error) {
      console.error('Error loading risk metrics:', error);
      set({ error: 'Failed to load risk metrics.', isLoading: false });
    }
  },

  startPolling: () => {
    setInterval(async () => {
      const prevTimestamp = get().lastUpdatedTimestamp;

      await get().loadRiskMetrics();

      // Ensure we fetch the latest timestamp after the state is updated
      set((state) => {
        if (state.lastUpdatedTimestamp && state.lastUpdatedTimestamp !== prevTimestamp) {
          useUnseenItemsStore.getState().addUnseenItems(resourceNameRiskMetrics, 1);
        }
        return {}; // No need to modify state, just ensuring correctness
      });
    }, 120000); // Polls every 2 minutes
  }
}));

// Initial Load and Start Polling
const { loadRiskMetrics, startPolling } = useRiskDataStore.getState();
loadRiskMetrics();
startPolling();
