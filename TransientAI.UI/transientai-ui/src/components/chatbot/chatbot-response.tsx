import {useContext, useEffect, useState} from 'react';
import styles from './chatbot-response.module.scss';
import {chatbotDataService} from '@/services/chatbot-data/chatbot-data-service';
import {ChatbotConversation, ChatHistory, ChatResponseType} from '@/services/chatbot-data/model';
import {Spinner} from '@radix-ui/themes';
import ReactMarkdown from 'react-markdown';
import {getCurrentTimestamp} from '@/lib/utility-functions/date-operations';
import {MenuInfo} from '@/services/menu-data';
import {ChatbotDataContext} from '@/services/chatbot-data';
import {useMenuStore} from '@/services/menu-data/menu-data-store';
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
      const lastChatHistory: ChatbotConversation =  {
        request: {
          query,
          isLoading: true,
          timestamp: getCurrentTimestamp()
        },
        response: {
          responseText: ''
        },
        status: {
          status: 'Thinking...',
          message: '',
          showLogs: true
        }
      };

      const newChatConversations: ChatbotConversation[] = [
        ...existingConversations,
        lastChatHistory
      ];

      setChatbotData({
        ...chatbotData,
        conversations: newChatConversations
      });

      const startTime = Date.now();
      let endTime: null|number = null;
      chatbotDataService.getChatbotResponseStream(query)
          .subscribe({
            next: (response) => {
              switch (response.type) {
                case ChatResponseType.Log:
                  lastChatHistory.status!.message += response.text;
                  break;
                case ChatResponseType.Final:
                  if (endTime === null) {
                    endTime = Date.now();
                    lastChatHistory.status!.status = `Thought for ${(endTime - startTime) / 1000} seconds`;
                    lastChatHistory.status!.showLogs = false;
                  }
                  lastChatHistory.response!.responseText += response.text;
                  break;
              }
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

      // try {
      //   const response = await chatbotDataService.getChatbotResponse(query);
      //   lastChatHistory.response!.responseText += response;
      //   setChatbotData({
      //     ...chatbotData,
      //     conversations: newChatConversations
      //   });
      // } finally {
      //   lastChatHistory.request!.isLoading = false;
      // }
    };

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
        <div key={index} className={styles['chat-message']}>
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
                    <div>{chatHistory.status!.status}</div>
                    <div>
                      <p>
                        <ReactMarkdown
                            className='markdown'
                            remarkPlugins={[remarkGfm]}
                        >{chatHistory.status!.message}</ReactMarkdown>
                      </p>
                    </div>
                    <div>
                      <p>
                        <ReactMarkdown
                            className='markdown'
                            remarkPlugins={[remarkGfm]}
                        >{chatHistory.response.responseText}</ReactMarkdown>
                      </p>
                    </div>
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