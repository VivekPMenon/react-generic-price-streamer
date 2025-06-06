//src/services/break-news/break-news-data-service.ts
import { webApihandler } from '../web-api-handler'
import {
  IUpdateCorpActionsConfig,
  IUpdateRoleConfigReq,
  IUpdateUserConfigReq,
  RoleFormData,
  SearchQueryType,
  SearchTableName,
  UserFormData
} from './model'
// import { BreakNewsItem } from "./model";

class AdminDashboardDataService {
  private serviceName = 'hurricane-api-2-0'

  async searchValues (
    table_name: SearchTableName,
    query_str: string,
    query_type?: SearchQueryType | '',
  ): Promise<any> {
    const results = await webApihandler.get(
      'admin/search',
      { table_name: table_name, query_type: query_type, query_str: query_str },
      { serviceName: this.serviceName }
    )
    return results
  }

  //Users API'S
  async getUser (user_id: number): Promise<any> {
    const results = await webApihandler.get(
      'admin/get_user',
      { user_id: user_id },
      { serviceName: this.serviceName }
    )
    return results
  }

  async getUserList (
    page: number,
    page_size: number,
    skip_pagination?: boolean,
    userid?: number
  ): Promise<any> {
    const results = await webApihandler.get(
      'admin/users',
      { userid: userid, page: page, page_size: page_size, skip_pagination: skip_pagination },
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
  async getRole (role_id: number): Promise<any> {
    const results = await webApihandler.get(
      'admin/roles',
      { role_id: role_id },
      { serviceName: this.serviceName }
    )
    return results
  }

  async getRolesList (
    page: number,
    page_size: number,
    skip_pagination?: boolean,
    roleid?: number
  ): Promise<any> {
    const results = await webApihandler.get(
      'admin/roles',
      { roleid: roleid, page: page, page_size: page_size, skip_pagination: skip_pagination },
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
      'admin/ca_margin_p&l',
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

  async updateProjectUserConfig (req: IUpdateUserConfigReq): Promise<any> {
    const results = await webApihandler.post(
      'admin/ca_margin_p&l',
      req,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async updateProjectRoleConfig (req: IUpdateRoleConfigReq): Promise<any> {
    const results = await webApihandler.post(
      'admin/pms',
      req,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async deleteCorpActions (data: any): Promise<any> {
    const results = await webApihandler.delete(
      'admin/corporate_actions',
      { serviceName: this.serviceName },
      {},
      data
    )
    return results
  }

  async deleteMarginData (data: any): Promise<any> {
    const results = await webApihandler.delete(
      'admin/margin_data',
      { serviceName: this.serviceName },
      {},
      data
    )
    return results
  }

  async deleteMarginPnLData (data: any): Promise<any> {
    const results = await webApihandler.delete(
      'admin/margin_p&l',
      { serviceName: this.serviceName },
      {},
      data
    )
    return results
  }

//Corp actions API's
  async getAccountList(): Promise<any> {
    const results = await webApihandler.get(
      'admin/accounts',
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async getCorpActionAssignedUsers (account_number: string): Promise<any> {
    const results = await webApihandler.get(
      `admin/accounts/users`,
      {account_number: account_number},
      { serviceName: this.serviceName }
    )
    return results
  }


  async updateProjectCorpActionsConfig (req: IUpdateCorpActionsConfig): Promise<any> {
    const results = await webApihandler.post(
      `admin/accounts/users`,
      req,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async deleteAssignedUsers (data: IUpdateCorpActionsConfig): Promise<any> {
    const results = await webApihandler.delete(
      `admin/accounts/users`,
      { serviceName: this.serviceName },
      {},
      data
    )
    return results
  }

}

export const adminDashboardDataService = new AdminDashboardDataService()
