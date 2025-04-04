import { webApihandler } from "../web-api-handler";
import { translateText } from '../../i18n'; // Import your translation function

class BreakNewsDataService {
  private serviceName = 'hurricane-api-2-0';

  async getBreakNews(): Promise<any> {
    const results = await webApihandler.get('entity/whatsapp_notification', {}, { serviceName: this.serviceName });
    
    // Translate the text content after fetching
    const translatedMessages = await Promise.all(
      results.data.unread_messages.map(async (message: any) => {
        message.text = await translateText(message.text, 'ja');  // Assuming 'text' is the field that needs translation
        return message;
      })
    );
    
    return { ...results, data: { unread_messages: translatedMessages } };
  }

  async getGroupMessages(groupId: string | number | null, page: number = 1, pageSize: number = 10): Promise<any> {
    const results = await webApihandler.get('entity/list_messages/', { group_id: groupId, page, page_size: pageSize }, { serviceName: this.serviceName });
    
    // Translate the group messages
    const translatedMessages = await Promise.all(
      results.data.messages.map(async (message: any) => {
        message.text = await translateText(message.text, 'ja');  // Translate text
        return message;
      })
    );
    
    return { ...results, data: { messages: translatedMessages } };
  }

  async getGroupList(): Promise<any> {
    const results = await webApihandler.get('entity/list-groups/', {}, { serviceName: this.serviceName });
    return results;
  }

  async updateMessageStatus(messageId: string | number): Promise<any> {
    const results = await webApihandler.put('entity/update-read-status/', {}, { id: messageId }, { serviceName: this.serviceName });
    return results;
  }
}

export const breakNewsDataService = new BreakNewsDataService();
