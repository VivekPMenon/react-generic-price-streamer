import { webApihandler } from '../web-api-handler';
import {ReportSummary, ResearchReport} from './model';

class ResearchReportsDataService {
  private serviceName = 'hurricane-api';

  async getReports(): Promise<ResearchReport[]> {
    const results = await webApihandler.get('latest-emails', {}, { serviceName: this.serviceName });
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

  async getAiSummaryAbstract(emailGuid: string): Promise<ReportSummary> {
    const result = await webApihandler.post(`summarize-email-abstract/${emailGuid}`, null, {}, { serviceName: this.serviceName });
    return { content: result.abstract_summary, images: result.images };
  }

  async getAiSummaryDetailed(emailGuid: string): Promise<ReportSummary> {
    const result = await webApihandler.post(`summarize-email-structured/${emailGuid}`, null, {}, { serviceName: this.serviceName });
    return { content: result.structured_summary, images: result.images };
  }

  async getAiSummaryExecutive(emailGuid: string): Promise<ReportSummary> {
    const result = await webApihandler.post(`summarize-email-executive/${emailGuid}`, null, {}, { serviceName: this.serviceName });
    return { content: result.executive_summary, images: result.images };
  }
}

export const researchReportsDataService = new ResearchReportsDataService();