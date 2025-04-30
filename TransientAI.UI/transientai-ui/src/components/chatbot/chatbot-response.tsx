import {ChangeEvent, useLayoutEffect, useRef, useState} from 'react';
import styles from './chatbot-response.module.scss';
import {ChatRole, ChatThread} from '@/services/chatbot-data/model';
import {useChatbotDataStore} from "@/services/chatbot-data/chatbot-data-store";
import {ChatRequestComponent} from "@/components/chatbot/chat-request-component";
import {ChatResponseComponent} from "@/components/chatbot/chat-response-component";

export function ChatbotResponse() {
  const [query, setQuery] = useState<string>('');
  const scrollDiv = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [, setScrollHeightChanged] = useState(false);
  const {
    setIsChatbotResponseActive,
    selectedThread,
    isLoading,
    addToThread
  } = useChatbotDataStore();
  const [thread, setThread] = useState<ChatThread | null>(selectedThread);

  useLayoutEffect(() => {
      if (thread !== selectedThread || isLoading) {
          setThread(selectedThread);
          const currentScrollHeight = scrollDiv.current?.scrollHeight;
          if (currentScrollHeight) {
              setScrollHeightChanged(true);
              setScrollHeight(currentScrollHeight);
              scrollDiv.current?.scrollTo({
                  top: scrollDiv.current.scrollHeight,
                  behavior: 'smooth'
              });
          } else {
              setScrollHeightChanged(false);
          }
      }
    }, [scrollDiv, scrollHeight, isLoading, thread, selectedThread]);

  function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    const inputValue = event.target.value;
    if (selectedThread) {
      addToThread(inputValue, selectedThread);
    }
    setQuery('');
  }

  function onQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function navigateBack() {
    setIsChatbotResponseActive(false);
  }

  const chatHistoryElement = thread?.messages?.length ?
      thread.messages.map((chatHistory, index) =>
          chatHistory.role === ChatRole.USER
          ? (<ChatRequestComponent
                  key={index}
                  message={chatHistory}
                  isLoading={index === thread.messages.length - 1 && isLoading}
              />)
          : (<ChatResponseComponent
                  key={index}
                  message={chatHistory}
              />)
      )
      : <></>;

  return (
      <div className={styles['chatbot-response']}>
        <button className='hyperlink' onClick={navigateBack}>Back to List</button>

        <div className={`${styles['chat-history']} scrollable-div`} ref={scrollDiv}>
          {chatHistoryElement}
        </div>

        <div className={styles['search-bar']}>
          <input type="text"
                 placeholder="Ask TransientAI anything - use '@' to find files, folders and other trading data"
                 onKeyDown={onKeyDown}
                 onChange={onQueryChange}
                 value={query}/>
        </div>
      </div>
  );
}