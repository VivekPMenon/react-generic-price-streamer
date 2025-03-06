import { create } from 'zustand';
import {File, fileManagerService} from "@/services/file-manager";
import { saveAs } from 'file-saver';

export interface RiskReportsState {
    riskReports: File[];
    selectedReport: {id: string, fileUrl: string} | null;
    setSelectedReport: (id: string | null) => void;
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
    setSelectedReport: (id) => {
        if (id) {
            const fileUrl = fileManagerService.getUploadedFileUrl(id);
            set({selectedReport: {id, fileUrl}});
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
        } catch(error) {
            console.error('Error sending email:', error);
        }
    }
}));

useRiskReportsSlice.getState().loadRiskReports();