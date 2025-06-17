//src/services/break-news/break-news-data-service.ts
import { IColumnItem } from '@/components/pms-live-new'
import { webApihandler } from '../web-api-handler'

class PmsDataService {
  private serviceName = 'hurricane-api-2-0'

  //Users API'S
  async getDisplayColumList (): Promise<any> {
    const results = await webApihandler.get(
      'pms_live/visible_fields',
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async getAllColumList (): Promise<any> {
    const results = await webApihandler.get(
      'pms_live/all_fields',
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async getPMSLiveData (
    page: number,
    page_size: number,
    additionalParams: any = {},
    skip_pagination?: boolean
  ): Promise<any> {
    const params = {
      page: page,
      page_size: page_size,
      skip_pagination: skip_pagination,
      ...additionalParams
    }

    const results = await webApihandler.get('pms_live/get_data', params, {
      serviceName: this.serviceName
    })
    return results
  }

 async downloadCSVFile(
  export_format: 'csv' | 'xlsx',
  filterParams: any = {}
): Promise<Response> {
  const params = {
    export_format: export_format,
    ...filterParams
  };

  const results = await webApihandler.get('pms_live/get_data', params, {
    serviceName: this.serviceName,
    responseType: 'blob',
    headers: {
      'Accept': export_format === 'xlsx' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv',
      'Accept-Language': 'en,en-US;q=0.9,ta;q=0.8',
      'Connection': 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
    }
  });
  
  return results;
}

  async createUser (data: IColumnItem[]): Promise<any> {
    const results = await webApihandler.post(
      'pms_live/preferences',
      data,
      {},
      { serviceName: this.serviceName }
    )
    return results
  }

  async updateColumns (data: any): Promise<any> {
    const results = await webApihandler.put(
      'pms_live/update_field',
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
