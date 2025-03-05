import { create } from 'zustand';
import {InquiryRequest} from "./model";
import {investorRelationsService} from "@/services/investor-relations-data/investor-relations-service";
import { useUserContextStore } from '@/services/user-context';

export interface InvestorRelationsStore {
    inquiries: InquiryRequest[];
    isLoading: boolean;
    isSaving: boolean;
    error: string;
    setInquiries: (inquiries: InquiryRequest[]) => void;
    loadInquiries: () => Promise<void>;
    save: (inquiry: InquiryRequest) => Promise<void>;
    changeStatus: (assignee: string, id: string, status: string) => Promise<void>;
}

export const useInvestorRelationsStore = create<InvestorRelationsStore>((set, get) => ({
    inquiries: [],
    isLoading: false,
    isSaving: false,
    error: '',
    setInquiries: (inquiries: InquiryRequest[]) => set({ inquiries }),
    loadInquiries: async () => {
        const userContext = useUserContextStore.getState().userContext;
        try {
            const inquiries = await investorRelationsService.getSubmittedTasks(userContext.userName!);
            inquiries.sort(
                (a: InquiryRequest, b: InquiryRequest) => {
                    const aDate = a?.due_date
                        ? new Date(a.due_date).getTime()
                        : -1;
                    const bDate = b?.due_date
                        ? new Date(b.due_date).getTime()
                        : -1;

                    return bDate - aDate;
                }
            )
            set({inquiries});
        } catch (e) {
            set({ inquiries: [], error: 'Failed to load inquiries' });
        }finally {
            set({ isLoading: false})
        }
    },
    save: async(inquiry: InquiryRequest)=> {
        try {
            set({ isSaving: true});
            const userContext = useUserContextStore.getState().userContext;
            inquiry.assignee_name = userContext.userName;
            await investorRelationsService.submit(inquiry);
        } catch (e) {
            set({ error: 'Failed to save inquiry'});
        } finally {
            set({ isSaving: false});
        }
        await get().loadInquiries();
    },
    changeStatus: async (assignee: string, id: string, status: string) => {
        try {
            set({ isSaving: true});
            await investorRelationsService.changeStatus(assignee, id, status);
        } catch (e) {
            set({ error: 'Failed to save inquiry status'});
            const inquiries = get().inquiries
            const found = get().inquiries.find(inquiry => inquiry.id === id);
            if (found) {
                found.completed = !found.completed;
                found.status = found.completed
                    ? 'completed'
                    : 'open';
                set({ inquiries: [...inquiries] });
            }
        } finally {
            set({ isSaving: false});
        }
        await get().loadInquiries();
    }
}));

const { loadInquiries } = useInvestorRelationsStore.getState();
loadInquiries();