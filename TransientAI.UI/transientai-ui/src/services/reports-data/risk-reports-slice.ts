import { create } from 'zustand';
import { File, fileManagerService } from '@/services/file-manager';
import { saveAs } from 'file-saver';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';

export const resourceNameRiskReports = 'risk-reports';

export interface RiskReportsState {
  riskReports: File[];
  selectedReport: { id: string; fileUrl: string } | null;
  setSelectedReport: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
  loadRiskReports: () => Promise<void>;
  deleteFile: (file: File) => Promise<void>;
  downloadFile: (file: File) => void;
  emailFile: (file: File, to: string, subject?: string, body?: string) => void;
  startPolling: () => void;
}

export const useRiskReportsSlice = create<RiskReportsState>((set, get) => ({
  riskReports: [],
  selectedReport: null,
  isLoading: false,
  error: null,

  setSelectedReport: (id) => {
    if (id) {
      const fileUrl = fileManagerService.getUploadedFileUrl(id);
      set({ selectedReport: { id, fileUrl } });
    } else {
      set({ selectedReport: null });
    }
  },

  loadRiskReports: async () => {
    set({ isLoading: true, error: null });

    try {
      const newRiskReports = await fileManagerService.getUploadedFiles();
      set({ riskReports: newRiskReports, isLoading: false });
    } catch (error) {
      console.error('Error loading risk reports:', error);
      set({ error: 'Failed to load risk reports.', isLoading: false });
    }
  },

  deleteFile: async (file: File) => {
    const { selectedReport, loadRiskReports, setSelectedReport } = get();
    const selectedFileId = file.id!;
    if (selectedFileId === selectedReport?.id) {
      setSelectedReport(null);
    }
    await fileManagerService.deleteFile(selectedFileId);
    await loadRiskReports();
  },

  downloadFile: (file: File) => {
    const fileUrl = fileManagerService.getUploadedFileUrl(file.id!);
    saveAs(fileUrl, file.filename);
  },

  emailFile: async (file: File, to: string, subject?: string, body?: string) => {
    try {
      await fileManagerService.emailFile(file.id!, to, subject, body);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },

  startPolling: () => {
    setInterval(async () => {
      const prevCount = get().riskReports.length;

      await get().loadRiskReports();

      // Use Zustand's `set` function to ensure the correct state is retrieved
      set((state) => {
        const newCount = state.riskReports.length;
        const unseenDiff = Math.abs(newCount - prevCount);

        if (unseenDiff > 0) {
          useUnseenItemsStore.getState().addUnseenItems(resourceNameRiskReports, unseenDiff);
        }

        return {}; // No need to modify state here, just ensuring correctness
      });
    }, 120000); // Polls every 2 minutes
  }
}));

// Initial Load and Start Polling
const { loadRiskReports, startPolling } = useRiskReportsSlice.getState();
loadRiskReports();
startPolling();
