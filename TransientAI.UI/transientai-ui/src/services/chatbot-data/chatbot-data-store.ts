import { create } from 'zustand';
import {ChatResponse, ChatThread} from "@/services/chatbot-data/model";
import {useUserContextStore} from "@/services/user-context";
import {finalize, Observable} from "rxjs";
import {chatbotDataService} from "@/services/chatbot-data/chatbot-data-service";

export interface ChatbotDataStore {
    query: string|null;
    setQuery: (query: string|null) => void;
    loadUserThreads: () => Promise<void>;
    chatThreads: ChatThread[];

    getChatbotResponseStream(request: string): Observable<ChatResponse>;
    loadThreadMessages(thread_id: string): Promise<ChatThread|null>;
    clearThread(thread_id: string): Promise<boolean>;
    createThread(): Promise<ChatThread|null>;
}

export const useChatbotDataStore = create<ChatbotDataStore>((set, get) => ({
    query: null,
    setQuery: (query) => {
        set({query});
    },

    loadUserThreads: async () => {
        const user_id = useUserContextStore.getState().userContext.userId;
        const result = await chatbotDataService.getUserThreads(user_id!);
        set({chatThreads: result});
    },

    chatThreads: [],
    getChatbotResponseStream: (request: string) => {
        const user_id = useUserContextStore.getState().userContext.userId;
        return chatbotDataService.getChatbotResponseStream(request, user_id!)
            .pipe(finalize(() => get().loadUserThreads()));
    },

    loadThreadMessages: (thread_id: string) => {
        const user_id = useUserContextStore.getState().userContext.userId;
        return chatbotDataService.getThreadMessages(thread_id, user_id!);
    },

    createThread: () => {
        const user_id = useUserContextStore.getState().userContext.userId;
        return chatbotDataService.createThread(user_id!)
    },

    clearThread: (thread_id: string) => {
        const user_id = useUserContextStore.getState().userContext.userId;
        return chatbotDataService.clearThread(thread_id, user_id!)
    }
}));