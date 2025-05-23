import { webApihandler } from '../web-api-handler';
import { endpointFinder } from '../web-api-handler/endpoint-finder-service';
import { ReportSummary, ReportType, ResearchReport } from './model';

class ResearchReportsDataService {
  private serviceName = 'hurricane-api';

  async getReports(emailId: string): Promise<ResearchReport[]> {
    const currentEnv = endpointFinder.getCurrentEnvInfo();
    if (currentEnv.testEmailId) {
      emailId = currentEnv.testEmailId!;
    }

    const results = await webApihandler.get('latest-emails/' + emailId, {}, { serviceName: this.serviceName });

    return results?.map((result: any) => ({
      id: result.id,
      name: result.subject,
      received_date: result.received_date,
      sender: result.sender,
      concise_summary: result.concise_summary,
    })) as ResearchReport[];
  }

  async searchReports(query: string): Promise<ResearchReport[]> {
    const result = await webApihandler.get(`search`, { query }, { serviceName: this.serviceName });

    return result.sources.map((source: any) => ({
      id: source.email_name,
      name: source.subject,
      received_date: source.date,
      sender: source.sender,
      concise_summary: result.concise_summary,
    })) as ResearchReport[];
  }

  async getEmailContentAsHtml(emailGuid: string, emailId: string): Promise<string> {
    const currentEnv = endpointFinder.getCurrentEnvInfo();
    if (currentEnv.testEmailId) {
      emailId = currentEnv.testEmailId!;
    }

    const url = emailId ? `email-html/${emailGuid}?research_email=${emailId}` : `email-html/${emailGuid}`;
    const result = await webApihandler.get(url, {}, { serviceName: this.serviceName });
    return result.html_content;
  }

  async getAiSummary(emailGuid: string, type: ReportType, emailId: string): Promise<ReportSummary> {
    let summaryService = '';
    let extractor: (result: any) => string;
    const currentEnv = endpointFinder.getCurrentEnvInfo();
    if (currentEnv.testEmailId) {
      emailId = currentEnv.testEmailId!;
    }

    switch (type) {
      case ReportType.Abstract:
        summaryService = 'summarize-email-abstract';
        extractor = (result: any) => result.abstract_summary;
        break;
      case ReportType.Detailed:
        summaryService = 'summarize-email-structured';
        extractor = (result: any) => result.structured_summary;
        break;
      case ReportType.ExecutiveSummary: 
        summaryService = 'summarize-email-executive';
        extractor = (result: any) => result.executive_summary;
        break;
      default:
        throw new Error(`Unknown summary type: ${type}`);
    }

    const result = await webApihandler.post(
      `${summaryService}/${emailGuid}`,
      null,
      { user_email: emailId },
      { serviceName: this.serviceName }
    );

    return {
      content: extractor(result),
      images: result.images,
    };
  }
}

export const researchReportsDataService = new ResearchReportsDataService();
