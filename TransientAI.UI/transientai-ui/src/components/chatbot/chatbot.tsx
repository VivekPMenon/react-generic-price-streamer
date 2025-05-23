'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChatbotResponse } from './chatbot-response';
import { ChatThread } from '@/services/chatbot-data/model';
import {chatbotStore} from "@/services/chatbot-data/chatbot-data-store";
import { formatDistanceToNow } from 'date-fns';
import {FormatDistanceOptions} from "date-fns/formatDistance";
import styles from './chatbot.module.scss';

function calculateVisibleHistories(chatHistories: ChatThread[], isAllChatsShown: boolean): ChatThread[] {
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

  const isChatbotResponseActive = chatbotStore.use.isChatbotResponseActive();
  const setIsChatbotResponseActive =  chatbotStore.use.setIsChatbotResponseActive();
  const setSelectedThread = chatbotStore.use.setSelectedThread();
  const chatThreads = chatbotStore.use.chatThreads();
  const clearThread = chatbotStore.use.clearThread();
  const createThread =  chatbotStore.use.createThread();

  const [chatHistories, setChatHistories] = useState<ChatThread[]>([]);
  const [, setQuery] = useState<string>();
  const [isAllChatsShown, setIsAllChatsShown] = useState<boolean>(false);
  const [idBeingDeleted, setIdBeingDeleted] = useState<string|null>(null);

  const visibleChatHistories = useMemo<ChatThread[]>(
      () => calculateVisibleHistories(chatHistories, isAllChatsShown),
      [isAllChatsShown, chatHistories])

  function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    const inputValue = event.target.value;
    createThread(inputValue).catch(error => console.error(error));
  }

  function selectPastQuery(thread: ChatThread) {
    setQuery('');
    setSelectedThread(thread);
    setIsChatbotResponseActive(true);
  }

  function deleteThread(chatHistory: ChatThread) {
    const id = chatHistory.id;
    if (idBeingDeleted === id || idBeingDeleted !== null) {
      return;
    }
    setIdBeingDeleted(id!);
    clearThread(id!)
        .catch(error => console.error(error))
        .finally(() => setIdBeingDeleted(null));
  }

  useEffect(() => {
    setChatHistories(chatThreads);
  }, [chatThreads]);

  if (isChatbotResponseActive) {
    return <div className={`${styles['chatbot-container']} widget`}>
      <ChatbotResponse />
    </div>;
  }

  return (
      <div className={`${styles['chatbot-container']} widget`}>
        <div className={styles['chatbot-header']}>
          <h1>Trade with TransientAI</h1>
          <p>Start a new chat or make edits to an existing workflow below</p>
        </div>

        <div className={styles['search-bar']}>
          <input type="text"
                 placeholder="Ask TransientAI anything - use '@' to find files, folders and other trading data"
                 onKeyDown={onKeyDown}/>
        </div>

        <div className={`${styles['workflow-list']} scrollable-div`}>
          <h2>Past chats & workflows</h2>
          {
            visibleChatHistories.map((chatHistory, index) => (
                <div className={styles['workflow-item']} key={`${chatHistory.id}_${index}`}>
                  <p onClick={() => selectPastQuery(chatHistory)}>{chatHistory.thread_name}</p>
                  <span>{chatHistory.updated_at ? formatDistanceToNow(chatHistory.updated_at, formatOptions) : ''}</span>
                  <i className={`fa-solid fa-xs fa-trash`} onClick={() => deleteThread(chatHistory)} />
                </div>
            ))
          }
        </div>

        <button className='hyperlink primary'
                onClick={() => setIsAllChatsShown(!isAllChatsShown)}>{isAllChatsShown ? 'Show less' : 'Show More'}</button>
      </div>
  );
}