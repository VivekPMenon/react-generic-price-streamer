//src/services/break-news/break-news-data-service.ts
import { webApihandler } from '../web-api-handler'
import { RoleFormData, UserFormData } from './model'
// import { BreakNewsItem } from "./model";

class AdminDashboardDataService {
  private serviceName = 'hurricane-api-2-0'


  //Users API'S
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

  async DeletUser (user_id: number,is_status: boolean): Promise<any> {
    const results = await webApihandler.delete(
      'user_management/delete_user',
      { serviceName: this.serviceName },
      { user_id: user_id, is_status: is_status }
    )
    return results
  }

  async UpdateActive (user_id: number,is_status: boolean): Promise<any> {
    const results = await webApihandler.put(
      'user_management/edit_user',
      { user_id: user_id, is_status: is_status },
      { serviceName: this.serviceName }
    )
    return results
  }

  //Roles API'S
   async getRoles (role_id: number): Promise<any> {
    const results = await webApihandler.get(
      'user_management/get_role',
      { role_id: role_id },
      { serviceName: this.serviceName }
    )
    return results
  }

   async getRolesList (page: number, page_size: number): Promise<any> {
    const results = await webApihandler.get(
      'user_management/list_roles',
      { page: page, page_size: page_size },
      { serviceName: this.serviceName }
    )
    return results
  }

   async createRole (roleDetail: RoleFormData): Promise<any> {
    const results = await webApihandler.post(
      'user_management/create_role',
      roleDetail,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

   async DeletRole (role_id: number,is_status: boolean): Promise<any> {
    const results = await webApihandler.delete(
      'user_management/delete_role',
      { serviceName: this.serviceName },
      { role_id: role_id, is_status: is_status }
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
