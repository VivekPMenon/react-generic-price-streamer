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

interface Time {
  hour: number;
  minute: number;
  seconds: number;
}

class PollManager {
  private handle: any;

  constructor(private readonly func: () => void,
              private readonly defaultTimeout: number,
              private readonly changeStart: Time,
              private readonly changeEnd: Time,
              private readonly timeout: number) {
  }

  public start(): void {
    this.startCore(this.defaultTimeout);
  }

  private startCore(timeout: number): void {
    this.handle = setTimeout(() => {

      this.func();

      if (this.handle) {
        clearTimeout(this.handle);
      }

      const now = new Date();
      const time: Time = {
        hour: now.getHours(),
        minute: now.getMinutes(),
        seconds: now.getSeconds()
      }

      const newTimeout: any = (this.isAfter(time, this.changeStart) && this.isBefore(time, this.changeEnd))
          ? this.timeout
          : this.defaultTimeout;

      this.startCore(newTimeout);

    }, timeout);
  }

  private isAfter(time1: Time, time2: Time): boolean {
    if (time1.hour < time2.hour) {
      return false;
    }

    if (time1.hour > time2.hour) {
      return true;
    }

    if (time1.minute < time2.minute) {
      return false;
    }

    if (time1.minute > time2.minute) {
      return true;
    }

    return time1.seconds > time2.seconds;
  }

  private isBefore(time1: Time, time2: Time): boolean {
    if (time1.hour < time2.hour) {
      return true;
    }

    if (time1.hour > time2.hour) {
      return false;
    }

    if (time1.minute < time2.minute) {
      return true;
    }

    if (time1.minute > time2.minute) {
      return false;
    }

    return time1.seconds < time2.seconds;
  }
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
    const pollManager = new PollManager(
        async () => {
          const {inquiries, loadInquiries} = get();

          const prevCount = inquiries.length;
          await loadInquiries();

          // Ensure we fetch the latest count after the state is updated
          const newCount = get().inquiries.length;
          const unseenDiff = newCount - prevCount;

          useUnseenItemsStore.getState().addUnseenItems(resourceNameInvestorRelations, unseenDiff);
        },
        120000, {
          hour: 10,
          minute: 55,
          seconds: 0,
        }, {
          hour: 12,
          minute: 15,
          seconds: 0,
        },
        2000
    );

    pollManager.start();
  }
}));

// Initial Load and Start Polling
const { loadInquiries, loadAssignees, startPolling } = useInvestorRelationsStore.getState();
loadInquiries();
loadAssignees();
startPolling();
