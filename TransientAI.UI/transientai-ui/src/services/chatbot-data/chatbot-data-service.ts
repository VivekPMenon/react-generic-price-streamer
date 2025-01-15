import { webApihandler } from "../web-api-handler";
import { ChatbotRequestType, ChatbotResponseType } from "./model";


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
}

export const chatbotDataService = new ChatbotDataService();