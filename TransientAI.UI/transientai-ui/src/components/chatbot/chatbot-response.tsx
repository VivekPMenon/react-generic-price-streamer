import { useEffect, useState } from 'react';
import styles from './chatbot-response.module.scss';
import { chatbotDataService } from '@/services/chatbot-data/chatbot-data-service';
import { ChatHistory } from '@/services/chatbot-data/model';
import { Spinner } from '@radix-ui/themes';
import ReactMarkdown from 'react-markdown';
import { getCurrentTimestamp } from '@/lib/utility-functions/date-operations';

export interface ChatbotResponseProps {
  selectedChatHistory: ChatHistory;
  onNavigateBack: () => void;
  onNewQueryExecuted: () => void;
}

export function ChatbotResponse(props: ChatbotResponseProps) {

  const [query, setQuery] = useState<string>('');
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  
  useEffect(() => calculateChatHistory(), [props.selectedChatHistory]);

  function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    const inputValue = event.target.value;
    executeChatbotRequest(inputValue);
    
    setQuery('');
  }

  function onQueryChange(event: any) {
    setQuery(event.target.value);
  }

  function calculateChatHistory() {
    if(props.selectedChatHistory.conversation_id) {
      setChatHistories([props.selectedChatHistory]);
      return;
    }

    executeChatbotRequest(props.selectedChatHistory.request?.query!);
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

      props.onNewQueryExecuted();
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
      <button className='hyperlink' onClick={props.onNavigateBack}>Back to List</button>

      <div className={styles['chat-history']}>
        {chatHistoryElement}
      </div>

      <div className={styles['search-bar']} >
        <input type="text" 
          placeholder="Ask TransientAI anything - use '@' to find files, folders and other trading data" 
          onKeyDown={onKeyDown}
          onChange={onQueryChange} 
          value={query}/>
      </div>
    </div>
  );
}



// function executeChatbotRequest(query: string) {
//   const executeChatbotRequestAsync = async () => {
//     const newChatHistories: ChatHistory[] = [
//       ...chatHistories,
//       {
//         request: {
//           query,
//           isLoading: true,
//           timestamp: getCurrentTimestamp()
//         }
//       }
//     ];
//     setChatHistories(newChatHistories);

//     const response = await chatbotDataService.streamChatbotResponse({ query });
//     if (!response.body) throw new Error('ReadableStream not supported');

//     const reader = response.body.getReader();
//     const decoder = new TextDecoder('utf-8');
//     let chatbotResponse = '';

//     // Read the streamed response
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;

//       // Decode the chunk of data and append it to the chatbot response
//       chatbotResponse += decoder.decode(value, { stream: true });

//       console.log(chatbotResponse)
//       const parsedResponse = extractResponse(chatbotResponse);
//       if (!parsedResponse) {
//         continue;
//       }

//       const lastChatHistory = newChatHistories[newChatHistories.length - 1];
//       lastChatHistory.response = { responseText: parsedResponse };

//       setChatHistories([
//         ...newChatHistories
//       ]);
//     }

//     const lastChatHistory = newChatHistories[newChatHistories.length - 1];
//     lastChatHistory.request!.isLoading = false;
//     lastChatHistory.response!.timestamp = getCurrentTimestamp();
//     setChatHistories([
//       ...newChatHistories
//     ]);
//   };

//   executeChatbotRequestAsync();
// }

// function extractResponse(jsonString: string) {
//   const regex = /"response":\s*"([^"]*)"/;

//   const match = jsonString.match(regex);

//   if (match && match[1]) {
//     return match[1];
//   } else {
//     return null; 
//   }
// }
