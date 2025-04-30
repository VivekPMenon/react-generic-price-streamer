import {ChangeEvent, useState} from 'react';
import styles from './chatbot-response.module.scss';
import {ChatMessage, ChatRole} from '@/services/chatbot-data/model';
import {Spinner} from '@radix-ui/themes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {ChevronDownIcon} from "@radix-ui/react-icons";
import {useChatbotDataStore} from "@/services/chatbot-data/chatbot-data-store";
import {formatDecimal} from "@/lib/utility-functions";

interface ChatRequestProps {
  message: ChatMessage;
  isLoading: boolean;
}

function ChatRequestComponent({message, isLoading}: ChatRequestProps) {
  return (
      <div className={styles['chat-message']}>
        <div className={styles['message-content']}>
          <div className={styles['message-header'] + ' profile-pic'}>
            <img src="/images/ProfilePicAI.png"></img>
          </div>
          <p>
            {message.content}
            {isLoading ? <Spinner size='3' className='ml-2'></Spinner> : <></>}
          </p>
        </div>

        <div className={styles['message-time']}>{message.timestamp?.toLocaleString()}</div>
      </div>
  );
}

interface ChatResponseProps {
  message: ChatMessage;
}

function ChatResponseComponent({message}: ChatResponseProps) {
  const [open, setOpen] = useState(false);

  function handleClick() {
    setOpen(!open);
  }

  return (
      <div className={`${styles['chat-message']}}`}>
        <div className={styles['assistant']}>
          <div className={`${styles['status']} prevent-text-selection`}
               onClick={handleClick}
          >
            {!message.response_time
                ? message.response_time === 0 ? `Thought for 0 seconds` : ''
                : `Thought for ${formatDecimal(message.response_time)} seconds`}
            <ChevronDownIcon
                className={`${styles['expander-button' + (open  ? '-open' : '')]}`}
            />
          </div>
          <div>
            {open &&
              (
                  <div className={styles['status-message']}>
                    <ReactMarkdown
                      className='markdown'
                      remarkPlugins={[remarkGfm]}
                      >{message.reasoning}
                    </ReactMarkdown>
                  </div>
              )
            }
            <ReactMarkdown
                className='markdown'
                remarkPlugins={[remarkGfm]}
            >{message.content}</ReactMarkdown>
          </div>
        </div>
        <div className={`${styles['assistant-message-time']}`}>{message.timestamp?.toLocaleString()}</div>
      </div>
  );
}

export function ChatbotResponse() {
  const [query, setQuery] = useState<string>('');
  const {
    setIsChatbotResponseActive,
    selectedThread,
    isLoading,
    addToThread
  } = useChatbotDataStore();

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

  const chatHistoryElement = selectedThread?.messages?.length ?
      selectedThread.messages.map((chatHistory, index) =>
          chatHistory.role === ChatRole.USER
          ? (<ChatRequestComponent
                  key={index}
                  message={chatHistory}
                  isLoading={index === selectedThread.messages.length - 2 && isLoading}
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

        <div className={`${styles['chat-history']} scrollable-div`}>
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