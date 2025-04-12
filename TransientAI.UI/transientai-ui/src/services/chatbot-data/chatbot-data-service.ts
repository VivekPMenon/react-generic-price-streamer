import { webApihandler } from "../web-api-handler";
import {ChatbotRequestType, ChatbotResponseType, ChatConversationApiResponse} from "./model";
import {fromStreamedResponse} from "@/lib/utility-functions/observables";
import {map, filter, Observable} from "rxjs";


class ChatbotDataService {

  async getChatbotResponse(request: ChatbotRequestType): Promise<ChatbotResponseType> {
    const result = await webApihandler.get('local_search', {
      stream: false,
      response_type: 'Multiple Paragraphs',
      ...request
    });

    return {
      responseText: result.response
    };
  }

  async getChatHistory(): Promise<ChatConversationApiResponse[]> {
    const result = await webApihandler.get('chat_history/' + webApihandler.userId, {});
    return result.conversations;
  }

  getChatbotResponseStream(request: ChatbotRequestType): Observable<string> {
    const textDecoder = new TextDecoder();
    return fromStreamedResponse(webApihandler.getStream('local_search', {
      stream: true,
      response_type: 'Multiple Paragraphs',
      ...request
    })).pipe(
        map(chunk => {
          const decoded = textDecoder.decode(chunk);
          return [...decoded.matchAll(/"response":\s*"(.*?)"/g).map(m => m[1])];
        }),
        filter(matches => matches.length > 0),
        map(matches => matches.join(' '))
    );
  }
}

export const chatbotDataService = new ChatbotDataService();