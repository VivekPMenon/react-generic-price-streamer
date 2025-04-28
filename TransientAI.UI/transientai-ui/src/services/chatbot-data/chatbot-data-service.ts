import { webApihandler } from "../web-api-handler";
import {ChatConversationApiResponse, ChatMessage, ChatResponse, ChatResponseType, ChatThread} from "./model";
import {mergeMap, Observable, from} from "rxjs";

class ChatbotDataService {
  private readonly serviceName = 'sell-side-api';

  async getChatbotResponse(request: string): Promise<string> {
    const result = await webApihandler.post('chat', undefined, {
      message: request,
      stream: false
    }, {
      serviceName: this.serviceName
    });
    return result.response;
  }

  getChatbotResponseStream(request: string, user_id: string): Observable<ChatResponse> {
    const response = webApihandler.post('chat', {
        message: request,
        user_id
    }, undefined, {
        serviceName: this.serviceName
    });
    return from(response).pipe(
        mergeMap((chunk: string) => {
          const match = chunk.match(/"thread_id"\s*:\s*"([^"]+)"[^}]*/g);
          const thread_id = (match && match.length) ? match[1] : null;
          return Array.from(
              chunk.matchAll(/{[^}]*"type"\s*:\s*"([^"]+)"[^}]*"text"\s*:\s*"([^"]+)"[^}]*}/g),
              ([, type, text]) =>({
                type,
                text: text.replace(/\\n/g, '\n'),
                thread_id
              } as ChatResponse))
              .filter(result => result.type === ChatResponseType.Log || ChatResponseType.Final);
        })
    );
  }

  async getUserThreads(user_id: string): Promise<ChatThread[]> {
      try {
          const result = await webApihandler.get('get-user-threads', {
              user_id
          }, {
              serviceName: this.serviceName
          });

          result.threads.forEach((thread: ChatThread) => {
              thread.created_at = new Date(result.created_at);
              thread.updated_at = new Date(result.updated_at);
              thread.messages.forEach(message => {
                  message.timestamp = new Date(message.timestamp);
              });
          })

          return result.threads;
      } catch (e: any) {
          return [];
      }
  }

  async getThreadMessages(thread_id: string, user_id: string): Promise<ChatThread|null> {
      try {
          const result = await webApihandler.get('get-thread-messages', {
              thread_id,
              user_id
          }, {
              serviceName: this.serviceName
          });

          result.created_at = new Date(result.created_at);
          result.updated_at = new Date(result.updated_at);
          result.messages.forEach((message: ChatMessage) => {
              message.timestamp = new Date(message.timestamp);
          })

          return result;
      } catch (e: any) {
          return null;
      }
  }

    async createThread(user_id: string): Promise<ChatThread|null> {
        try {
            const result = await webApihandler.post('new-thread', undefined, {
                user_id
            }, {
                serviceName: this.serviceName
            });

            result.created_at = new Date(result.created_at);
            result.updated_at = new Date(result.updated_at);
            result.messages.forEach((message: ChatMessage) => {
                message.timestamp = new Date(message.timestamp);
            })

            return result;
        } catch (e: any) {
            return null;
        }
    }

    async clearThread(thread_id: string, user_id: string): Promise<boolean> {
        try {
            await webApihandler.delete('clear-thread', {
                serviceName: this.serviceName
            }, {
                thread_id,
                user_id
            });
            return true;
        } catch (e: any) {
            return false;
        }
    }

  // async getChatbotResponse(request: ChatbotRequestType): Promise<ChatbotResponseType> {
  //   const result = await webApihandler.get('local_search', {
  //     stream: false,
  //     response_type: 'Multiple Paragraphs',
  //     ...request
  //   });
  //
  //   return {
  //     responseText: result.response
  //   };
  // }

  async getChatHistory(): Promise<ChatConversationApiResponse[]> {
    const result = await webApihandler.get('chat_history/' + webApihandler.userId, {});
    return result.conversations;
  }

  // getChatbotResponseStream(request: ChatbotRequestType): Observable<string> {
  //   const textDecoder = new TextDecoder();
  //   return fromStreamedResponse(webApihandler.getStream('local_search', {
  //     stream: true,
  //     response_type: 'Multiple Paragraphs',
  //     ...request
  //   })).pipe(
  //       map(chunk => {
  //         const decoded = textDecoder.decode(chunk);
  //         return [...decoded.matchAll(/"response":\s*"(.*?)"/g)
  //             .map(m => m[1].replace(/\\n/g, '\n'))
  //             .filter(m => m.length > 0)];
  //       }),
  //       filter(matches => matches.length > 0),
  //       map(matches => matches.join(''))
  //   );
  // }
}

export const chatbotDataService = new ChatbotDataService();