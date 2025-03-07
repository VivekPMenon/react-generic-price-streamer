import { create } from 'zustand';
import { RiskMetricsItem } from './model';
import { riskDataService } from './risk-data-service';

export interface RiskDataState {
  riskMetricsItems: RiskMetricsItem[] | null;
  setRiskMetricsItems: (riskMetricsItems: RiskMetricsItem[]) => void;
  selectedRiskMetricsItem: RiskMetricsItem | null;
  lastUpdatedTimestamp: string;
  setSelectedRiskMetricsItem: (riskMetricsItem: RiskMetricsItem | null) => void;
  loadRiskMetrics: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useRiskDataStore = create<RiskDataState>((set) => ({
  riskMetricsItems: null,
  setRiskMetricsItems: (riskMetricsItems) => set({ riskMetricsItems }),
  selectedRiskMetricsItem: null,
  setSelectedRiskMetricsItem: (riskMetricsItem) => set({ selectedRiskMetricsItem: riskMetricsItem }),
  isLoading: false,
  error: null,
  lastUpdatedTimestamp: '',
  loadRiskMetrics: async () => {
    set({ isLoading: true, error: null }); // Start loading, reset error
    try {
      const result = await riskDataService.getRiskMetrics();
      set({ riskMetricsItems: result?.margin_data, isLoading: false }); // Data loaded, stop loading
      set({ lastUpdatedTimestamp: result?.timestamp });
    } catch (error) {
      console.error('Error loading risk metrics:', error);
      set({ error: 'Failed to load risk metrics.', isLoading: false }); // Set error, stop loading
    }
  },
}));

// Immediately call loadRiskMetrics when the store is initialized.
const { loadRiskMetrics } = useRiskDataStore.getState();
loadRiskMetrics();
