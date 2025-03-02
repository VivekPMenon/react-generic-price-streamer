import { create } from 'zustand';
import {File, fileManagerService} from "@/services/file-manager";
import { saveAs } from 'file-saver';

export interface RiskReportsState {
    riskReports: File[];
    selectedReport: {filename: string, fileUrl: string} | null;
    setSelectedReport: (fileName: string | null) => void;
    isLoading: boolean;
    error: string | null;
    loadRiskReports: () => Promise<void>;
    deleteFile:  (file: File) => Promise<void>;
    downloadFile:  (file: File) => void;
    emailFile: (file: File, to: string, subject?: string, body?: string) => void;
}

export const useRiskReportsSlice = create<RiskReportsState>((set, get) => ({
    riskReports: [],
    selectedReport: null,
    setSelectedReport: (filename) => {
        if (filename) {
            const fileUrl = fileManagerService.getUploadedFileUrl(filename);
            set({selectedReport: {filename, fileUrl}});
        } else {
            set({selectedReport: null});
        }
    },
    isLoading: false,
    error: null,
    loadRiskReports: async () => {
        set({ isLoading: true, error: null });
        try {
            const riskReports = await fileManagerService.getUploadedFiles();
            set({ riskReports, isLoading: false });
        } catch (error) {
            console.error('Error loading risk reports:', error);
            set({ error: 'Failed to load risk reports.', isLoading: false });
        }
    },
    deleteFile: async (file: File) => {
        const { selectedReport, loadRiskReports, setSelectedReport } = get();
        const selectedFileName = file.filename!;
        if (selectedFileName === selectedReport?.filename) {
            setSelectedReport(null);
        }
        await fileManagerService.deleteFile(selectedFileName);
        await loadRiskReports();
    },
    downloadFile: (file: File) => {
        const fileUrl = fileManagerService.getUploadedFileUrl(file.filename);
        saveAs(fileUrl, file.filename);
    },
    emailFile: async (file: File, to: string, subject?: string, body?: string) => {
        await fileManagerService.emailFile(file.filename, to, subject, body);
    }
}));

useRiskReportsSlice.getState().loadRiskReports();