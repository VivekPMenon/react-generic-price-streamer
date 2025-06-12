import {ChangeEvent, useLayoutEffect, useRef, useState} from 'react';
import styles from './chatbot-response.module.scss';
import {ChatRole, ChatThread} from '@/services/chatbot-data/model';
import {ChatRequestComponent} from "@/components/chatbot/chat-request-component";
import {ChatResponseComponent} from "@/components/chatbot/chat-response-component";

export interface ChatbotResponseProps {
    showBackButton: boolean;
    inputHint: string;
    isChatbotResponseActive: boolean;
    setIsChatbotResponseActive: null|((value: boolean) => void);
    selectedThread: ChatThread|null;
    isLoading: boolean;
    addToThread: null|((query: string, thread:ChatThread) => void);
}

export function ChatbotResponse(props: ChatbotResponseProps) {
  const [query, setQuery] = useState<string>('');
  const scrollDiv = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [, setScrollHeightChanged] = useState(false);
  const [thread, setThread] = useState<ChatThread | null>(props.selectedThread);

  useLayoutEffect(() => {
      if (thread !== props.selectedThread || props.isLoading) {
          setThread(props.selectedThread);
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
    }, [scrollDiv, scrollHeight, props.isLoading, thread, props.selectedThread]);

  function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    const inputValue = event.target.value;
    if (props.selectedThread && props.addToThread) {
      props.addToThread(inputValue, props.selectedThread);
    }
    setQuery('');
  }

  function onQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function navigateBack() {
      if (props.setIsChatbotResponseActive) {
          props.setIsChatbotResponseActive(false);
      }
  }

  const chatHistoryElement = thread?.messages?.length ?
      thread.messages.map((chatHistory, index) =>
          chatHistory.role === ChatRole.USER
          ? (<ChatRequestComponent
                  key={index}
                  message={chatHistory}
                  isLoading={index === thread.messages.length - 1 && props.isLoading}
              />)
          : (<ChatResponseComponent
                  key={index}
                  message={chatHistory}
              />)
      )
      : <></>;

  return (
      <div className={styles[`chatbot-response`]}>
        {props.showBackButton && (<button className='hyperlink' onClick={navigateBack}>Back to List</button>)}

        <div className={`${styles['chat-history']} scrollable-div`} ref={scrollDiv}>
          {chatHistoryElement}
        </div>

        <div className={styles[`search-bar${props.showBackButton ? '' : ('-with-selector' + ((thread?.messages?.length ?? 0) === 0 ? '' : '-has-messages')) }`]}>
            {!props.showBackButton && (thread?.messages?.length ?? 0) === 0 && (
                <span>What can I help you with today?</span>
            )}
          <input type="text"
                 placeholder={props.inputHint}
                 onKeyDown={onKeyDown}
                 onChange={onQueryChange}
                 value={query}/>
        </div>
      </div>
  );
}