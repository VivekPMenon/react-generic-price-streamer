import { webApihandler } from "../web-api-handler";
import {ChatConversationApiResponse} from "./model";

class ChatbotDataService {
  private readonly serviceName = 'sell-side-api';

  async getChatbotResponse(request: string): Promise<string> {
    const result = await webApihandler.post('chat', undefined, {
      message: request
    }, {
      serviceName: this.serviceName
    });
    return result.response;
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