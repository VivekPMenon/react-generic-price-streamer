import { create } from 'zustand';
import { InquiryRequest, InquiryStatus } from './model';
import { investorRelationsService } from '@/services/investor-relations-data/investor-relations-service';
import { useUserContextStore } from '@/services/user-context';
import { useUnseenItemsStore } from '../unseen-items-store/unseen-items-store';
import {clearInterval} from "node:timers";

export const resourceNameInvestorRelations = 'investor-relations';

export interface InvestorRelationsStore {
  inquiries: InquiryRequest[];
  assignees: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: string;
  setInquiries: (inquiries: InquiryRequest[]) => void;
  loadInquiries: () => Promise<void>;
  save: (inquiry: InquiryRequest) => Promise<void>;
  changeStatus: (id: string, status: InquiryStatus) => Promise<void>;
  deleteInquiry: (id: string) => Promise<boolean>;
  loadAssignees: () => Promise<void>;
  updateStatusFromCompleted: (inquiry: InquiryRequest) => void;
  startPolling: () => void;
}

export const useInvestorRelationsStore = create<InvestorRelationsStore>((set, get) => ({
  inquiries: [],
  assignees: [],
  isLoading: false,
  isSaving: false,
  error: '',

  setInquiries: (inquiries: InquiryRequest[]) => set({ inquiries }),

  loadInquiries: async () => {
    const userContext = useUserContextStore.getState().userContext;
    try {
      const inquiries = await investorRelationsService.getSubmittedTasks(userContext.userName!);
      inquiries.sort((a, b) => {
        const aDate = a?.due_date ? new Date(a.due_date).getTime() : -1;
        const bDate = b?.due_date ? new Date(b.due_date).getTime() : -1;
        return bDate - aDate;
      });

      set({ inquiries });
    } catch (e: any) {
      set({ inquiries: [], error: 'Failed to load inquiries' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteInquiry: async (id: string): Promise<boolean> => {
    try {
      await investorRelationsService.deleteTask(id);
      await get().loadInquiries();
      return true;
    } catch (e: any) {
      set({ error: 'Failed to delete inquiry' });
      return false;
    }
  },

  save: async (inquiry: InquiryRequest) => {
    const userContext = useUserContextStore.getState().userContext;
    try {
      set({ isSaving: true });
      inquiry.owner_name = userContext.userName;
      await investorRelationsService.submit(inquiry);
    } catch (e: any) {
      set({ error: 'Failed to save inquiry' });
    } finally {
      set({ isSaving: false });
    }
    await get().loadInquiries();
  },

  changeStatus: async (id: string, status: InquiryStatus) => {
    const state = get();
    try {
      set({ isSaving: true });
      await investorRelationsService.changeStatus(id, status);
    } catch (e: any) {
      set({ error: 'Failed to save inquiry status' });
      const inquiries = state.inquiries;
      const found = state.inquiries.find((inquiry) => inquiry.id === id);
      if (found) {
        found.completed = !found.completed;
        state.updateStatusFromCompleted(found);
        set({ inquiries: [...inquiries] });
      }
    } finally {
      set({ isSaving: false });
    }
    await state.loadInquiries();
  },

  loadAssignees: async () => {
    try {
      const assignees = await investorRelationsService.getAssignees();
      assignees.sort();
      set({ assignees });
    } catch (e) {
      set({ assignees: [], error: 'Failed to load assignees' });
    }
  },

  updateStatusFromCompleted: (inquiry: InquiryRequest) => {
    inquiry.status = inquiry.completed ? InquiryStatus.Completed : InquiryStatus.Open;
  },

  startPolling: () => {
    setInterval(async () => {
          const {inquiries, loadInquiries} = get();

          const prevCount = inquiries.length;
          await loadInquiries();

          // Ensure we fetch the latest count after the state is updated
          const newCount = get().inquiries.length;
          const unseenDiff = newCount - prevCount;

          useUnseenItemsStore.getState().addUnseenItems(resourceNameInvestorRelations, unseenDiff);
        }, 120000
    );
  }
}));

// Initial Load and Start Polling
const { loadInquiries, loadAssignees, startPolling } = useInvestorRelationsStore.getState();
loadInquiries();
loadAssignees();
startPolling();
