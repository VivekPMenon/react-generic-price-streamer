'use client';

import { createContext, useState } from "react";
import { ChatbotData, ChatbotDataContextType } from "./model";

export const ChatbotDataContext = createContext<ChatbotDataContextType>({
  chatbotData: {
    conversations: []
  },
  setChatbotData: () => {}
});

export function ChatbotDataContextProvider({children}: any) {

  const [chatbotData, setChatbotData] = useState<ChatbotData>({
  });

  return <ChatbotDataContext.Provider value={{chatbotData, setChatbotData}}>
    {children}
  </ChatbotDataContext.Provider>
}