//src/services/break-news/break-news-data-service.ts
import { webApihandler } from '../web-api-handler'
import { RoleFormData, UserFormData } from './model'
// import { BreakNewsItem } from "./model";

class AdminDashboardDataService {
  private serviceName = 'hurricane-api-2-0'

  //Users API'S
  async getUser (user_id: number): Promise<any> {
    const results = await webApihandler.get(
      'admin/get_user',
      { user_id: user_id },
      { serviceName: this.serviceName }
    )
    return results
  }

  async getUserList (page: number, page_size: number,skip_pagination?: boolean): Promise<any> {
    const results = await webApihandler.get(
      'admin/users',
      { page: page, page_size: page_size,skip_pagination: skip_pagination },
      { serviceName: this.serviceName }
    )
    return results
  }

  async createUser (userDetail: UserFormData): Promise<any> {
    const results = await webApihandler.post(
      'admin/user',
      userDetail,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async updateUser (userDetail: UserFormData): Promise<any> {
    const results = await webApihandler.put(
      'admin/user',
      userDetail,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async DeletUser (user_id: number, is_active: boolean): Promise<any> {
    const results = await webApihandler.delete(
      'admin/user',
      { serviceName: this.serviceName },
      { user_id: user_id, is_active: is_active }
    )
    return results
  }

  async UpdateActive (user_id: number, is_active: boolean): Promise<any> {
    const results = await webApihandler.put(
      'admin/user',
      { user_id: user_id, is_active: is_active },
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  //Roles API'S
  async getRoles (role_id: number): Promise<any> {
    const results = await webApihandler.get(
      'admin/roles',
      { role_id: role_id },
      { serviceName: this.serviceName }
    )
    return results
  }

  async getRolesList (page: number, page_size: number): Promise<any> {
    const results = await webApihandler.get(
      'admin/roles',
      { page: page, page_size: page_size },
      { serviceName: this.serviceName }
    )
    return results
  }

  async createRole (roleDetail: RoleFormData): Promise<any> {
    const results = await webApihandler.post(
      'admin/roles',
      roleDetail,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async DeletRole (role_id: number, is_active: boolean): Promise<any> {
    const results = await webApihandler.delete(
      'admin/roles',
      { serviceName: this.serviceName },
      { role_id: role_id, is_active: is_active }
    )
    return results
  }

  //Projects API'S
  async getProjectsList (page: number, page_size: number): Promise<any> {
    const results = await webApihandler.get(
      'admin/project_list',
      { page: page, page_size: page_size },
      { serviceName: this.serviceName }
    )
    return results
  }

  async getProjectsUsersConfig (user_id: number): Promise<any> {
    const results = await webApihandler.get(
      'admin/margin',
      { user_id: user_id },
      { serviceName: this.serviceName }
    )
    return results
  }

  async getProjectsRolesConfig (role_id: number): Promise<any> {
    const results = await webApihandler.get(
      'admin/pms',
      { role_id: role_id },
      { serviceName: this.serviceName }
    )
    return results
  }

   async updateProjectUserConfig (config: any): Promise<any> {
    const results = await webApihandler.post(
      'admin/margin',
      config,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

    async updateProjectRoleConfig (config: any): Promise<any> {
    const results = await webApihandler.post(
      'admin/pms',
      config,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }


   async deleteCorpActions (user_id : number, corp_actions_id  : number[]): Promise<any> {
    const results = await webApihandler.delete(
      'admin/corporate_actions',
      { serviceName: this.serviceName },
      { user_id: user_id, corp_actions_id : corp_actions_id }
    )
    return results
  }

   async deleteMarginData (user_id : number, margin_data : string[]): Promise<any> {
    const results = await webApihandler.delete(
      'admin/margin_data',
      { serviceName: this.serviceName },
      { user_id: user_id, margin_data: margin_data }
    )
    return results
  }



}

export const adminDashboardDataService = new AdminDashboardDataService()
