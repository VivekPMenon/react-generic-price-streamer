import {create} from 'zustand';
import {ChatMessage, ChatResponse, ChatResponseType, ChatRole, ChatThread} from "@/services/chatbot-data/model";
import {useUserContextStore} from "@/services/user-context";
import {finalize, Observable} from "rxjs";
import {chatbotDataService} from "@/services/chatbot-data/chatbot-data-service";

export interface ChatbotDataStore {
    loadUserThreads: () => Promise<void>;
    chatThreads: ChatThread[];
    selectedThread: ChatThread|null;
    setSelectedThread: (thread: ChatThread|null) => void;

    isLoading: boolean;

    isChatbotResponseActive: boolean;
    setIsChatbotResponseActive: (isChatbotResponseActive: boolean) => void;

    getChatbotResponseStream(request: string, thread_id?: string): Observable<ChatResponse>;
    // loadThreadMessages(thread_id: string): Promise<ChatThread|null>;
    clearThread(thread_id: string): Promise<void>;
    createThread(query: string): Promise<void>;
    addToThread: (query: string, thread: ChatThread) => void;
}

export const PROCESSING_VALUE = 'Thinking...';

export const useChatbotDataStore = create<ChatbotDataStore>((set, get) => ({
    isLoading: false,

    loadUserThreads: async () => {
        const user_id = useUserContextStore.getState().userContext.userId;
        const result = await chatbotDataService.getUserThreads(user_id!);
        set({chatThreads: result});
    },

    chatThreads: [],
    getChatbotResponseStream: (request: string, thread_id?: string) => {
        const user_id = useUserContextStore.getState().userContext.userId;
        return chatbotDataService.getChatbotResponseStream(request, thread_id, user_id!)
            .pipe(finalize(() => get().loadUserThreads()));
    },

    selectedThread: null,
    setSelectedThread: (thread: ChatThread|null) => {
        set({selectedThread: thread});
    },

    isChatbotResponseActive: false,
    setIsChatbotResponseActive: (isChatbotResponseActive: boolean) => {
      set({isChatbotResponseActive});
    },

    // loadThreadMessages: (thread_id: string) => {
    //     const user_id = useUserContextStore.getState().userContext.userId;
    //     return chatbotDataService.getThreadMessages(thread_id, user_id!);
    // },

    createThread: async (query: string) => {
        const user_id = useUserContextStore.getState().userContext.userId;
        const thread = await chatbotDataService.createThread(user_id!);
        if (thread)  {
            get().addToThread(query, thread);
        }
    },

    addToThread: (query: string, thread: ChatThread) => {
        const { getChatbotResponseStream } = get();

        const request: ChatMessage = {
            role: ChatRole.USER,
            content: query,
            timestamp: new Date(),
        };
        thread.messages.push(request);

        const message: ChatMessage = {
            role: ChatRole.ASSISTANT,
            reasoning: PROCESSING_VALUE,
            content: '',
            timestamp: new Date(),
        };
        thread.messages.push(message);

        set({
            isLoading: true,
            isChatbotResponseActive: true,
            selectedThread: thread,
        })

        const thread_id = thread.id;
        const startTime = Date.now();
        let endTime: null | number = null;
        getChatbotResponseStream(query, thread_id)
            .subscribe({
                next: (response) => {
                    switch (response.type) {
                        case ChatResponseType.Log:
                            if (message.reasoning === PROCESSING_VALUE) {
                                message.reasoning = response.text;
                            } else {
                                message.reasoning += response.text;
                            }
                            break;
                        case ChatResponseType.Final:
                            if (endTime === null) {
                                endTime = Date.now();
                                message.response_time = (endTime - startTime) / 1000;
                            }
                            message.content += response.text;
                            break;
                    }

                    thread.messages[thread.messages.length - 1] = {...message};
                    thread.messages = [...thread.messages];

                    set({selectedThread: thread});
                },
                error: () => {
                    if (endTime === null) {
                        endTime = Date.now();
                        message.response_time = (endTime - startTime) / 1000;
                    }
                    message.content = 'There was an error processing your request';
                    message.timestamp = new Date();
                    message.reasoning = undefined;

                    thread.messages[thread.messages.length - 1] = {...message};
                    thread.messages = [...thread.messages];

                    set({isLoading: false, selectedThread: thread});
                },
                complete: () => {
                    message.timestamp = new Date();
                    thread.messages[thread.messages.length - 1] = {...message};
                    thread.messages = [...thread.messages];
                    set({isLoading: false, selectedThread: thread});
                }
            });
    },

    clearThread: async (thread_id: string) => {
        const user_id = useUserContextStore.getState().userContext.userId;
        const success = await chatbotDataService.clearThread(thread_id, user_id!)
        if (success) {
            await get().loadUserThreads();
        }
    }
}));