import {webApihandler} from '../web-api-handler';
import { useUserContextStore } from '@/services/user-context';
import {ReportSummary, ReportType, ResearchReport} from './model';

class ResearchReportsDataService {
  private serviceName = 'hurricane-api';

  async getReports(): Promise<ResearchReport[]> {
    const {userContext} = useUserContextStore.getState()
    const results = await webApihandler.get('latest-emails', {
      userName: userContext.userName,
      userId: userContext.userId
    }, { serviceName: this.serviceName });
    return results?.map((result: any) => ({
      id: result.id,
      name: result.subject,
      received_date: result.received_date,
      sender: result.sender,
      concise_summary: result.concise_summary
    } as ResearchReport));
  }

  async searchReports(query: string): Promise<ResearchReport[]> {
    const result = await webApihandler.get(`search`, { query }, { serviceName: this.serviceName });
    return result.sources.map((source: any) => ({
      id: source.email_name,
      name: source.subject,
      received_date: source.date,
      sender: source.sender,
      concise_summary: result.concise_summary
    } as ResearchReport));
  }

  async getEmailContentAsHtml(emailGuid: string): Promise<string> {
    const result = await webApihandler.get(`email-html/${emailGuid}`, {}, { serviceName: this.serviceName });
    return result.html_content;
  }

  async getAiSummary(emailGuid: string, type: ReportType): Promise<ReportSummary> {
    let serviceName= '';
    let extractor: (result: any) => string;
    switch (type) {
      case ReportType.Abstract:
        serviceName = 'summarize-email-abstract';
        extractor = (result: any) => result.abstract_summary;
        break;
      case ReportType.Detailed:
        serviceName = 'summarize-email-structured/';
        extractor = (result: any) => result.structured_summary;
        break;
      case ReportType.ExecutiveSummary:
        serviceName = 'summarize-email-executive';
        extractor = (result: any) => result.executive_summary;
        break;
      default:
        throw new Error(`Unknown type ${type}`);
    }
    const result = await webApihandler.post(`${serviceName}/${emailGuid}`, null, {}, { serviceName: this.serviceName });
    return { content: extractor(result), images: result.images };
  }
}

export const researchReportsDataService = new ResearchReportsDataService();