//src/services/break-news/break-news-data-service.ts
import { webApihandler } from '../web-api-handler'


class PmsDataService {
  private serviceName = 'hurricane-api-2-0'



  //Users API'S
  async getColumList (): Promise<any> {
    const results = await webApihandler.get(
      'pms_live/fields_list',
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  

  async createUser (data: any): Promise<any> {
    const results = await webApihandler.post(
      'pms_live/preferences',
      data,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async updateColumnOrder (data: any): Promise<any> {
    const results = await webApihandler.put(
      'pms_live/preferences',
      data,
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

  
}

export const pmsDataService = new PmsDataService()
