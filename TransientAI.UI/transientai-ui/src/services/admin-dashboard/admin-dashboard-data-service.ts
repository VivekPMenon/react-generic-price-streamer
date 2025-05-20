//src/services/break-news/break-news-data-service.ts
import { webApihandler } from '../web-api-handler'
import { UserFormData } from './model'
// import { BreakNewsItem } from "./model";

class AdminDashboardDataService {
  private serviceName = 'hurricane-api-2-0'

  async getUser (user_id: number): Promise<any> {
    const results = await webApihandler.get(
      'user_management/get_user',
      { user_id: user_id },
      { serviceName: this.serviceName }
    )
    return results
  }

  async getUserList (page: number, page_size: number): Promise<any> {
    const results = await webApihandler.get(
      'user_management/list_users',
      { page: page, page_size: page_size },
      { serviceName: this.serviceName }
    )
    return results
  }

  async createUser (userDetail: UserFormData): Promise<any> {
    const results = await webApihandler.post(
      'user_management/add_user',
      userDetail,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async updateUser (userDetail: UserFormData): Promise<any> {
    const results = await webApihandler.put(
      'user_management/edit_user',
      userDetail,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async DeletUser (user_id: number): Promise<any> {
    const results = await webApihandler.delete(
      'user_management/delete_user',
      { serviceName: this.serviceName },
      { user_id: user_id }
    )
    return results
  }

  async updateMessageStatus (messageId: string | number): Promise<any> {
    const results = await webApihandler.put(
      'entity/update-read-status/',
      {},
      { id: messageId },
      { serviceName: this.serviceName }
    )
    return results
  }
}

export const adminDashboardDataService = new AdminDashboardDataService()
