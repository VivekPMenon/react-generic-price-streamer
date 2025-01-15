import { useEffect, useState } from 'react';
import styles from './chatbot-response.module.scss';
import { chatbotDataService } from '@/services/chatbot-data/chatbot-data-service';
import { ChatbotResponseType, ChatHistory } from '@/services/chatbot-data/model';
import { Spinner } from '@radix-ui/themes';
import ReactMarkdown from 'react-markdown';
import { getCurrentTimestamp } from '@/lib/utility-functions/date-operations';

export interface ChatbotResponseProps {
  query?: string;
  isPastQuery?: boolean;
  navigateBack?: () => void;
}

export function ChatbotResponse(props: ChatbotResponseProps) {

  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

  useEffect(() => executeChatbotRequest(props.query!), [props.query]);

  function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    const inputValue = event.target.value;
    executeChatbotRequest(inputValue);
  }

  function executeChatbotRequest(query: string) {
    const executeChatbotRequestAsync = async () => {
      const newChatHistories: ChatHistory[] = [
        ...chatHistories,
        {
          request: {
            query,
            isLoading: true,
            timestamp: getCurrentTimestamp()
          }
        }
      ];
      setChatHistories(newChatHistories);

      const response = await chatbotDataService.getChatbotResponse({ query });

      const lastChatHistory = newChatHistories[newChatHistories.length - 1];
      lastChatHistory.response = response;
      lastChatHistory.request!.isLoading = false;
      lastChatHistory.response.timestamp = getCurrentTimestamp();

      setChatHistories([
        ...newChatHistories
      ]);
    };

    executeChatbotRequestAsync();
  }

  const chatHistoryElement = chatHistories?.length ?
    chatHistories.map(chatHistory => (
      <>
        <div className={styles['chat-message']}>
          <div className={styles['message-content']}>
            <div className={styles['message-header'] + ' profile-pic'}>VM</div>
            <p>
              {chatHistory.request?.query}
              {chatHistory.request?.isLoading ? <Spinner size='3' className='ml-2'></Spinner> : <></>}
            </p>
          </div>

          <div className={styles['message-time']}>{chatHistory.request?.timestamp}</div>
        </div>

        {
          chatHistory.response?.responseText ? <div className={`${styles['chat-message']}}`}>
            <div className={styles['assistant']}>
              <p>
                <ReactMarkdown>{chatHistory.response?.responseText}</ReactMarkdown>
              </p>
              {/* <div className={styles['recommendation-card']}>
                <div className={styles['recommendation-icon']}>✅</div>
                <div className={styles['recommendation-text']}>Tech Sector Bond Recommendations</div>
              </div> */}
            </div>

            <div className={`${styles['assistant-message-time']}`}>{chatHistory.response?.timestamp}</div>
          </div> : <></>
        }
      </>
    ))
    : <></>;

  return (
    <div className={styles['chatbot-response']}>
      <button className='hyperlink' onClick={props.navigateBack}>Back to List</button>

      <div className={styles['chat-history']}>
        {chatHistoryElement}
      </div>

      <div className={styles['search-bar']} >
        <input type="text" placeholder="Ask TransientAI anything - use '@' to find files, folders and other trading data" onKeyDown={onKeyDown}/>
      </div>
    </div>
  );
}