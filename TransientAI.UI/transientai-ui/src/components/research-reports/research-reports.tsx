import { useEffect, useState } from 'react';
import styles from './research-reports.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DropdownMenu } from '@radix-ui/themes';
import { reportsDataService, ResearchReport } from '@/services/reports-data';

export interface ResearchReportsProps {
  isExpanded: boolean;
}

export function ResearchReports({ isExpanded }: ResearchReportsProps) {

  const [isSummaryVisible, setIsSummaryVisible] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<ResearchReport>({});
  const [reports, setReports] = useState<ResearchReport[]>([]);

  useEffect(() => {
    const results = reportsDataService.getReports();
    setReports(results);
  },[]);

  return (
    <div className={styles['research-reports']}>

      <div className={styles['report-list']}>

        <div className={styles['filter-panel']}>
          Search:
          <input type='text'></input>
          {/* <i className='fa-solid fa-filter'></i> */}
        </div>

        <div className='news'>
          {
            reports.map(report =>
              <div className={report.name === selectedReport.name ? 'news-item active' : 'news-item'}
                onClick={() => { setIsSummaryVisible(true); setSelectedReport(report) }}>
                <div className='news-content'>
                  <div className='news-title'>
                    <i className='fa-regular fa-file-lines'></i>
                    {report.name}
                  </div>
                </div>
              </div>
            )
          }
        </div>

      </div>

      {
        isSummaryVisible ?
          <>
            <div className={`${styles['email-content']} scrollable-div ${isExpanded ? styles['expanded'] : ''}`}>
              <ReactMarkdown className='markdown' remarkPlugins={[remarkGfm]}>{selectedReport.emailContent}</ReactMarkdown>
            </div>

            <div className={`${styles['ai-summary']} scrollable-div ${isExpanded ? styles['expanded'] : ''}`}>
              <div className={styles['key-words']}>
                Keywords: <span>VC Landscape, Systematic Quant Strategies, Geo Political and Headline Risk</span>
              </div>
              <ReactMarkdown className='markdown' remarkPlugins={[remarkGfm]}>{selectedReport.aiSummary}</ReactMarkdown>
            </div>
          </> : <></>
      }


    </div>
  );
}