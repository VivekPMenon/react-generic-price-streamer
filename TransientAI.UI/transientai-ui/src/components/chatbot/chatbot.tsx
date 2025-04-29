'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { ChatbotResponse } from './chatbot-response';
import { ChatHistory } from '@/services/chatbot-data/model';
import { ChatbotDataContext } from '@/services/chatbot-data';
import {useChatbotDataStore} from "@/services/chatbot-data/chatbot-data-store";
import { formatDistanceToNow } from 'date-fns';
import {FormatDistanceOptions} from "date-fns/formatDistance";
import styles from './chatbot.module.scss';

function calculateVisibleHistories(chatHistories: ChatHistory[], isAllChatsShown: boolean): ChatHistory[] {
  if (isAllChatsShown) {
    return chatHistories;
  }

  return chatHistories.slice(0, 10);
}

const formatOptions: FormatDistanceOptions = {
  includeSeconds: false,
  addSuffix: true
}

export function Chatbot() {
  const { query: externalQuery, setQuery: setExternalQuery, chatThreads, loadUserThreads } = useChatbotDataStore();
  const { chatbotData, setChatbotData } = useContext(ChatbotDataContext);

  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [query, setQuery] = useState<string>();
  const [isAllChatsShown, setIsAllChatsShown] = useState<boolean>(false);

  const visibleChatHistories = useMemo<ChatHistory[]>(
      () => calculateVisibleHistories(chatHistories, isAllChatsShown),
      [isAllChatsShown, chatHistories])

  useEffect(() => {
    const chatHistories = chatThreads.map(rawChatHistory => {
      return {
        title: rawChatHistory.thread_name,
        conversation_id: rawChatHistory.id,
        request: {
          query: rawChatHistory.messages?.length ? rawChatHistory.messages[0].content : 'not available',
          timestampDate: rawChatHistory.messages?.length ? rawChatHistory.messages[0].timestamp : undefined
        },
        response: {
          responseText: rawChatHistory.messages?.length! > 1 ? rawChatHistory.messages![1].content : 'not available'
        }
      } as ChatHistory;
    });
    setChatHistories(chatHistories);
  }, [chatThreads]);

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
          },
          status: {
            message: '',
            status: '',
            showLogs: false
          }
        }
      ]
    });
  }

  useEffect(() => {
    if (externalQuery) {
      setQuery(externalQuery);
      setChatbotData({
        ...chatbotData,
        isChatbotResponseActive: true
      });
      setExternalQuery(null);
    }
  }, [externalQuery, setExternalQuery, chatbotData, setChatbotData]);

  if (chatbotData?.isChatbotResponseActive) {
    return <div className={`${styles['chatbot-container']} widget`}>
      <ChatbotResponse
        query={query!}
        onNewQueryExecuted={loadUserThreads}>
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
          visibleChatHistories.map((chatHistory, index) => (
            <div className={styles['workflow-item']} onClick={() => selectPastQuery(chatHistory)} key={`${chatHistory.title}_${index}`}>
              <p>{chatHistory.title}</p>
              <span>{chatHistory.request?.timestampDate ? formatDistanceToNow(chatHistory.request?.timestampDate, formatOptions) : ''}</span>
            </div>
          ))
        }
      </div>
      
      <button className='hyperlink primary' onClick={() => setIsAllChatsShown(!isAllChatsShown)}>{isAllChatsShown ? 'Show less' : 'Show More'}</button>
    </div>
  );
}