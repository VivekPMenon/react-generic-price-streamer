import {create} from 'zustand';
import {useUserContextStore} from "@/services/user-context";
import {createSelectors} from "@/lib/utility-functions/store-operations";
import {AgentType} from "@/services/chat-data/model";
import {chatDataService} from "@/services/chat-data/chat-data-service";
import {ChatMessage, ChatRole, ChatThread} from "@/services/chatbot-data";
import {stringToEnum} from "@/lib/utility-functions/enum-operations";
import {PROCESSING_VALUE} from "@/services/chatbot-data/chatbot-data-store";

export interface ChatDataStore {
    isLoading: boolean;
    selectedThread: ChatThread;
    agent: AgentType;
    setAgent: (agent: string) => void;
    addToThread: (query: string, thread: ChatThread) => void;
}

const useChatDataStore = create<ChatDataStore>()((set, get) => ({
    isLoading: false,
    agent: AgentType.FMP,
    selectedThread: {
        id: crypto.randomUUID(),
        user_id: '',
        thread_name: '',
        messages: [],
        created_at: new Date(),
        updated_at: new Date()
    },
    setAgent: (agent: string) => {
        const agentType = stringToEnum(AgentType, agent);
        set({agent: agentType});
    },

    addToThread: (query: string, thread: ChatThread) => {
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
            selectedThread: thread,
        });

        const {agent} = get();
        const user_id = useUserContextStore.getState().userContext.userId;

        chatDataService.sendChatRequest(query, user_id!, agent)
            .then(response => {
                message.reasoning = undefined;
                message.content = response;
                thread.messages[thread.messages.length - 1] = {...message};
                thread.messages = [...thread.messages];
                set({isLoading: false, selectedThread: {
                        ...thread
                    }});
            });
    },
}));

export const chatDataStore = createSelectors(useChatDataStore);