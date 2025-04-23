import { create } from 'zustand';


export interface ChatbotDataStore {
    query: string|null;
    setQuery: (query: string|null) => void;
}

export const useChatbotDataStore = create<ChatbotDataStore>((set) => ({
    query: null,
    setQuery: (query) => {
        set({query});
    }
}));