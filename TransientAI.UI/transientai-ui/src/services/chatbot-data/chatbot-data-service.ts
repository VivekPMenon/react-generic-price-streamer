import { webApihandler } from "../web-api-handler";
import {ChatResponse, ChatResponseType, ChatThread} from "./model";
import {mergeMap, Observable, from} from "rxjs";
import {parseIsoDate} from "@/lib/utility-functions/date-operations";

class ChatbotDataService {
  private readonly serviceName = 'sell-side-api';

  getChatbotResponseStream(request: string, thread_id: string|undefined, user_id: string): Observable<ChatResponse> {
      const data: { [key: string]: any } = {
          message: request,
          user_id
      };
      if (thread_id) {
          data['thread_id'] = thread_id;
      }
      const response = webApihandler.post('chat', data, undefined, {
          serviceName: this.serviceName
      });
      return from(response).pipe(
          mergeMap((chunk: string) => {
              const match = chunk.match(/"thread_id"\s*:\s*"([^"]+)"[^}]*/g);
              const thread_id = (match && match.length) ? match[1] : null;
              return Array.from(
                  chunk.matchAll(/{[^}]*"type"\s*:\s*"([^"]+)"[^}]*"text"\s*:\s*"([^"]+)"[^}]*}/g),
                  ([, type, text]) => ({
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

          result.threads.forEach((thread: any) => {
              thread.created_at = parseIsoDate(thread.created_at);
              thread.updated_at = parseIsoDate(thread.updated_at);
              thread.messages.forEach((message: any) => {
                  message.timestamp = parseIsoDate(message.timestamp);
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

          result.created_at = parseIsoDate(result.created_at);
          result.updated_at = parseIsoDate(result.updated_at);
          result.messages.forEach((message: any) => {
              message.timestamp = parseIsoDate(message.timestamp);
          });

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

            result.created_at = parseIsoDate(result.created_at);
            result.updated_at = parseIsoDate(result.updated_at);
            result.messages.forEach((message: any) => {
                message.timestamp = parseIsoDate(message.timestamp);
            });

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
}

export const chatbotDataService = new ChatbotDataService();