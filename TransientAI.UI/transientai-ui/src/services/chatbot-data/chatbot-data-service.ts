import { webApihandler } from "../web-api-handler";
import { ChatbotRequestType, ChatbotResponseType, ChatConversationApiResponse } from "./model";


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

  async streamChatbotResponse(request: ChatbotRequestType): Promise<Response> {
    const result = await webApihandler.getStream('local_search', {
      stream: true,
      response_type: 'Multiple Paragraphs',
      ...request
    });

    return result;
  }
}

export const chatbotDataService = new ChatbotDataService();