'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import styles from './chatbot.module.scss';
import { ChatbotResponse } from './chatbot-response';
import { ChatbotConversation, ChatHistory } from '@/services/chatbot-data/model';
import { chatbotDataService } from '@/services/chatbot-data/chatbot-data-service';
import { ChatbotDataContext } from '@/services/chatbot-data';

export function Chatbot() {

  const { chatbotData, setChatbotData } = useContext(ChatbotDataContext);

  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [query, setQuery] = useState<string>();
  const [isAllChatsShown, setIsAllChatsShown] = useState<boolean>(false);

  const visisbleChatHistories = useMemo<ChatHistory[]>(() => calculateVisibleHistories(), [
    isAllChatsShown,
    chatHistories
  ])

  useEffect(() => loadChatHistories(), []);

  function loadChatHistories() {
    const loadChatHistoriesAsync = async () => {
      const rawChatHistories = await chatbotDataService.getChatHistory();

      const chatHistories = rawChatHistories.map(rawChatHistory => {
        return {
          title: rawChatHistory.title,
          conversation_id: rawChatHistory.conversation_id,
          request: {
            query: rawChatHistory.messages?.length ? rawChatHistory.messages[0].content : 'not available'
          },
          response: {
            responseText: rawChatHistory.messages?.length! > 1 ? rawChatHistory.messages![1].content : 'not available'
          }
        } as ChatHistory;
      });
      setChatHistories(chatHistories);
    };

    loadChatHistoriesAsync();
  }

  function calculateVisibleHistories(): ChatHistory[] {
    if (isAllChatsShown) {
      return chatHistories;
    }

    return chatHistories.slice(0, 10);
  }

  function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    const inputValue = event.target.value;
    setQuery(inputValue);
    setChatbotData({
      ...chatbotData,
      isChatbotResponseActive: true
    });
  }

  function selectPastQuery(chatConversation: ChatHistory) {
    setQuery('');
    setChatbotData({
      title: chatConversation.title,
      isChatbotResponseActive: true,
      conversations: [
        {
          request: {
            query: chatConversation.request?.query
          },
          response: {
            responseText: chatConversation.response?.responseText
          }
        }
      ]
    });
  }

  if (chatbotData?.isChatbotResponseActive) {
    return <div className={`${styles['chatbot-container']} widget`}>
      <ChatbotResponse
        query={query!}
        onNewQueryExecuted={loadChatHistories}>
      </ChatbotResponse>
    </div>;
  }

  return (
    <div className={`${styles['chatbot-container']} widget`}>
      <div className={styles['chatbot-header']}>
        <h1>Trade with TransientAI</h1>
        <p>Start a new chat or make edits to an existing workflow below</p>
      </div>

      <div className={styles['search-bar']} >
        <input type="text" placeholder="Ask TransientAI anything - use '@' to find files, folders and other trading data" onKeyDown={onKeyDown} />
      </div>

      <div className={`${styles['workflow-list']} scrollable-div`}>
        <h2>Past chats & workflows</h2>
        {
          visisbleChatHistories.map(chatHistory => (
            <div className={styles['workflow-item']} onClick={() => selectPastQuery(chatHistory)} key={chatHistory.title}>
              <p>{chatHistory.title}</p>
              <span>2 days</span>
            </div>
          ))
        }
      </div>
      
      <button className='hyperlink primary' onClick={() => setIsAllChatsShown(!isAllChatsShown)}>{isAllChatsShown ? 'Show less' : 'Show More'}</button>
    </div>
  );
}