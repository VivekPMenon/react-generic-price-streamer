import { useEffect, useState } from 'react';
import styles from './chatbot-response.module.scss';
import { chatbotDataService } from '@/services/chatbot-data/chatbot-data-service';
import { ChatbotResponseType, ChatHistory } from '@/services/chatbot-data/model';
import { Spinner } from '@radix-ui/themes';
import ReactMarkdown from 'react-markdown';

export interface ChatbotResponseProps {
  query?: string;
  isPastQuery?: boolean;
}

export function ChatbotResponse(props: ChatbotResponseProps) {

  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

  useEffect(() => executeChatbotRequest(props.query!), [props.query]);

  function executeChatbotRequest(query: string) {
    const executeChatbotRequestAsync = async () => {

      const newChatHistories: ChatHistory[] = [
        ...chatHistories,
        {
          request: {
            query,
            isLoading: true
          }
        }
      ];
      setChatHistories(newChatHistories);

      const response = await chatbotDataService.getChatbotResponse({ query });

      const lastChatHistory = newChatHistories[newChatHistories.length - 1];
      lastChatHistory.response = response;
      lastChatHistory.request!.isLoading = false;

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

          <div className={styles['message-time']}>10:33 AM</div>
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

            <div className={styles['message-time']}>10:33 AM</div>
          </div> : <></>
        }
      </>
    ))
    : <></>;

  return (
    <div className={styles['chatbot-response']}>
      <button className='hyperlink'>Back to List</button>

      {chatHistoryElement}

      <div className={styles['search-bar']} >
        <input type="text" placeholder="Ask TransientAI anything - use '@' to find files, folders and other trading data" />
      </div>
    </div>
  );
}