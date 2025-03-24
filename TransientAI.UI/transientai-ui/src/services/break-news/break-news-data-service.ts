import { webApihandler } from "../web-api-handler";
// import { BreakNewsItem } from "./model";

class BreakNewsDataService {
  private serviceName = 'hurricane-api-2-0';

  async getBreakNews(): Promise<any> {
    const results = await webApihandler.get('entity/whatsapp_notification', {}, { serviceName: this.serviceName });
    return results;
  }
  
  async getGroupMessages(groupId: string | number | null,page: number = 1, pageSize: number = 10): Promise<any> {
    const results = await webApihandler.get('entity/list_messages/', {group_id:groupId,page:page,page_size:pageSize}, { serviceName: this.serviceName });
    return results;
  }

  async getGroupList(): Promise<any> {
    const results = await webApihandler.get('entity/list-groups/',{}, { serviceName: this.serviceName });
    return results;
  }

  async updateMessageStatus(messageId: string | number): Promise<any> {
    const results = await webApihandler.put('entity/update-read-status/', {}, {id:messageId}, { serviceName: this.serviceName });
    return results;
  }
}

export const breakNewsDataService = new BreakNewsDataService();