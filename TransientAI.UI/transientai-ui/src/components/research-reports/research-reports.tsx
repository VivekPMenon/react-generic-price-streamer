'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './research-reports.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Segmented from 'rc-segmented';
import { SearchableMarkdown } from '@/components/markdown';
import { getReports, ResearchReport } from '@/services/reports-data';
import EmailViewer from '../email-parser/email-viewer';


export interface ResearchReportsProps {
  isExpanded?: boolean;
}

export function ResearchReports({ isExpanded }: ResearchReportsProps) {

  const [isSummaryVisible, setIsSummaryVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<ResearchReport>({});
  const [reports, setReports] = useState<ResearchReport[]>([]);

  const visibleReports = useMemo<ResearchReport[]>(() => applyFilter(), [searchQuery, reports]);

  useEffect(() => { loadReports() }, []);

  async function loadReports() {
    const results = await getReports();
    setReports(results);
  }

  function applyFilter(): ResearchReport[] {
    if (!searchQuery) {
      return reports;
    }

    return reports.filter(report => report.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <div className={styles['research-reports']}>

      <div className={styles['report-list']}>

        <div className={styles['filter-panel']}>
          Search:
          <input type='text' className='mb-2' value={searchQuery} onChange={event => setSearchQuery(event.target.value)}></input>
          {/* <i className='fa-solid fa-filter'></i> */}
          Summary Type:
          <Segmented
            className={styles['format-type']}
            selected={true}
            options={['Short', 'Medium', 'Verbose']}
            onChange={(value) => { }}
          />
        </div>

        <div className='news'>
          {
            visibleReports.map(report =>
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
            <div className={`${styles['email-content']} ${isExpanded ? styles['expanded'] : ''}`}>
              <div className={styles['summary-title']}>
                Original Email
              </div>

              <div>
                <EmailViewer className='height-vh-68' htmlSource={selectedReport?.emailSource} />
              </div>
            </div>

            <div className={`${styles['ai-summary']} ${isExpanded ? styles['expanded'] : ''}`}>
              <div className={styles['summary-title']}>
                AI Summary
              </div>

              <div className={styles['key-words']}>
                {/* Keywords: <span>VC Landscape, Systematic Quant Strategies, Geo Political and Headline Risk</span> */}
              </div>
              {/* <SearchableMarkdown markdownContent={selectedReport.aiSummary} className={isExpanded ? 'height-vh-82': 'height-vh-36'} /> */}
              <SearchableMarkdown markdownContent={selectedReport.aiSummary} className={'height-vh-68'} />
            </div>
          </> : <></>
      }


    </div>
  );
}

