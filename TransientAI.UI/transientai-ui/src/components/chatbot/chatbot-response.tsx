import { useEffect, useState } from 'react';
import styles from './chatbot-response.module.scss';
import { chatbotDataService } from '@/services/chatbot-data/chatbot-data-service';
import { ChatbotConversation, ChatHistory } from '@/services/chatbot-data/model';
import { Spinner } from '@radix-ui/themes';
import ReactMarkdown from 'react-markdown';
import { getCurrentTimestamp } from '@/lib/utility-functions/date-operations';
import { MenuInfo } from '@/services/menu-data';
import { ChatbotDataContext } from '@/services/chatbot-data';
import { useContext } from 'react';
import { useMenuStore } from '@/services/menu-data/menu-data-store';
import remarkGfm from 'remark-gfm';

export interface ChatbotResponseProps {
  query: string;
  onNewQueryExecuted: () => void;
}

export function ChatbotResponse(props: ChatbotResponseProps) {

  const { fullMenuList, setActiveMenu } = useMenuStore();
  const { chatbotData, setChatbotData } = useContext(ChatbotDataContext);

  const [query, setQuery] = useState<string>('');

  useEffect(() => loadChatbotResponse(), [props.query]);

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

  function loadChatbotResponse() {
    if (!props.query) {
      return;
    }

    executeChatbotRequest(props.query!);
  }

  function executeChatbotRequest(query: string) {
    const executeChatbotRequestAsync = async () => {

      const existingConversations = chatbotData.conversations || [];
      const newChatConversations: ChatbotConversation[] = [
        ...existingConversations,
        {
          request: {
            query,
            isLoading: true,
            timestamp: getCurrentTimestamp()
          }
        }
      ];
      setChatbotData({
        ...chatbotData,
        conversations: newChatConversations
      });

      const lastChatHistory = newChatConversations[newChatConversations.length - 1];
      if (!lastChatHistory.response) {
        lastChatHistory.response = {responseText: ''};
      }

      chatbotDataService.getChatbotResponseStream({query})
          .subscribe({
            next: (response) => {
              lastChatHistory.response!.responseText += response;
              setChatbotData({
                ...chatbotData,
                conversations: newChatConversations
              });
            },
            complete: () => {
              lastChatHistory.request!.isLoading = false;
              lastChatHistory.response!.timestamp = getCurrentTimestamp();
              setChatbotData({
                ...chatbotData,
                conversations: newChatConversations
              });
              props.onNewQueryExecuted();
            }
          });
    }

    executeChatbotRequestAsync();
  }

  function clipChatHistory(chatHistory: ChatHistory) {
    const newMenuItem: MenuInfo = {
      description: chatHistory.title,
      icon: 'fa-solid fa-thumbtack',
      id: chatHistory.conversation_id
    };
    
    setActiveMenu(newMenuItem);
  }

  function navigateBack() {
    setChatbotData({
      isChatbotResponseActive: false,
      conversations: []
    });
  }

  const chatHistoryElement = chatbotData.conversations?.length ?
    chatbotData.conversations.map((chatHistory, index) => (
      <>
        <div className={styles['chat-message']}>
          <div className={styles['message-content']}>
            <div className={styles['message-header'] + ' profile-pic'}>
              <img src="/images/ProfilePicAI.png"></img>
            </div>
            <p>
              {chatHistory.request?.query}
              {chatHistory.request?.isLoading ? <Spinner size='3' className='ml-2'></Spinner> : <></>}
              {
                index === 0 && !chatHistory.request?.isLoading ?
                  <i onClick={() => clipChatHistory(chatHistory)}
                    className={styles['clip-conversation'] + ' fa-solid fa-thumbtack'}>
                  </i> : <></>
              }
            </p>
          </div>

          <div className={styles['message-time']}>{chatHistory.request?.timestamp}</div>
        </div>

        {
          chatHistory.response?.responseText
              ? <div className={`${styles['chat-message']}}`}>
                  <div className={styles['assistant']}>
                    <p>
                      <ReactMarkdown
                          className='markdown'
                          remarkPlugins={[remarkGfm]}
                      >{chatHistory.response.responseText}</ReactMarkdown>
                    </p>
                  </div>
                  <div className={`${styles['assistant-message-time']}`}>{chatHistory.response?.timestamp}</div>
                </div>
              : <></>
        }
      </>
    ))
    : <></>;

  return (
    <div className={styles['chatbot-response']}>
      <button className='hyperlink' onClick={navigateBack}>Back to List</button>

      <div className={`${styles['chat-history']} scrollable-div`}>
        {chatHistoryElement}
      </div>

      <div className={styles['search-bar']} >
        <input type="text"
          placeholder="Ask TransientAI anything - use '@' to find files, folders and other trading data"
          onKeyDown={onKeyDown}
          onChange={onQueryChange}
          value={query} />
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
