'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './research-reports.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Segmented from 'rc-segmented';
import { SearchableMarkdown } from '@/components/markdown';
import { researchReportsDataService, ResearchReport, useResearchReportsStore } from '@/services/reports-data';
import EmailViewer from '../email-parser/email-viewer';
import Tags from "@/components/tags/tags";
import ImageContainer from "@/components/image-container/image-container";
import { useScrollTo } from '@/lib/hooks';
import { Spinner } from '@radix-ui/themes';


export interface ResearchReportsProps {
  isExpanded?: boolean;
}

export function ResearchReports({ isExpanded }: ResearchReportsProps) {

  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>();

  const { isLoading, reports, selectedReport, setSelectedReport } = useResearchReportsStore();

  const [searchedReports, setSearchedReports] = useState<ResearchReport[]>([]);
  const [isSummaryVisible, setIsSummaryVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchResultsLoading, setIsSearchResultsLoading] = useState<boolean>(false);

  const [emailContent, setEmailContent] = useState<string>('');
  const [aiContentAbstract, setAiContentAbstract] = useState<string>('');
  const [aiContentDetailed, setAiContentDetailed] = useState<string>('');
  const [summaryType, setSummaryType] = useState<'Abstract' | 'Verbose'>('Abstract');

  const visibleReports = useMemo<ResearchReport[]>(() => calculateVisibleReports(), [searchedReports, reports]);

  useEffect(() => { onReportSelection(selectedReport!) }, [selectedReport]);

  async function searchReports(event: any) {
    const inputValue = event.target.value;
    if (event.key !== "Enter") {
      return;
    }

    if (inputValue === '') {
      setSearchedReports([]);
      return;
    }

    setIsSearchResultsLoading(true);
    const searchedReports = await researchReportsDataService.searchReports(inputValue);

    setIsSearchResultsLoading(false);
    setSearchedReports(searchedReports);
  }

  function calculateVisibleReports(): ResearchReport[] {
    if (searchedReports?.length) {
      return searchedReports;
    }

    return reports;
  }

  async function onReportSelection(report: ResearchReport) {
    if (!report?.id) {
      return;
    }

    setIsSummaryVisible(true);
    setSelectedReport(report);
    // setEmailContent('');
    setAiContentAbstract('');
    setAiContentDetailed('');

    // purposefully keeping sequential as the AISummary call takes too much time sometimes
    const emailContent = await researchReportsDataService.getEmailContentAsHtml(report.id!)
    setEmailContent(emailContent);
    scrollToTarget();

    const aiContentAbstract = await researchReportsDataService.getAiSummaryAbstract(report.id!);
    setAiContentAbstract(aiContentAbstract);

    // time consuming call, doing it in the background
    const aiContentDetails = await researchReportsDataService.getAiSummaryDetailed(report.id!);
    setAiContentDetailed(aiContentDetails);
  }

  function getFinalAiContent() {
    if (summaryType === 'Abstract') {
      return aiContentAbstract;
    }

    return aiContentDetailed;
  }

  return (
    <div className={styles['research-reports']}>

      <div className={styles['reports-container']}>

        <div className={styles['filter-panel']}>
          Search:

          {/* Todo.. move the seacrch textbox in to common component */}
          <div className={styles['search-box']}>
            <input type='text' className='mb-2'
              autoFocus={true}
              autoComplete='on'
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              onKeyDown={event => searchReports(event)}></input>

            {
              searchQuery ? <i className='fa-solid fa-remove' onClick={event => { setSearchQuery(''); setSearchedReports([]) }}></i> : <i className='fa-solid fa-magnifying-glass'></i>
            }

          </div>

          Summary Type:
          <Segmented
            className={styles['format-type']}
            value={summaryType}
            options={['Abstract', 'Verbose']}
            onChange={(value: any) => { setSummaryType(value) }}
          />
        </div>

        <div className={`${styles['reports']} news scrollable-div`}>
          {
            isLoading || isSearchResultsLoading ?
              <Spinner size="3" className='self-center'></Spinner>
              :
              <>
                {
                  visibleReports.map(report =>
                    <div className={report.name === selectedReport?.name ? 'news-item active' : 'news-item'}
                      onClick={() => { onReportSelection(report) }}>
                      <div className='news-content'>
                        <div className='news-title'>
                          <i className='fa-regular fa-file-lines'></i>
                          {report.name}
                        </div>

                        {
                          report.concise_summary &&
                          <div className='news-description'>
                            <div>{report.concise_summary}</div>
                          </div>
                        }
                      </div>
                    </div>
                  )
                }
              </>
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
                {/* {
                  emailContent ? <EmailViewer className='height-vh-68' emailHtml={emailContent} /> : <Spinner size="3" className='self-center p-2'></Spinner>
                } */}
                <EmailViewer className='height-vh-68' emailHtml={emailContent} />
              </div>
            </div>

            <div className={`${styles['ai-summary']} ${isExpanded ? styles['expanded'] : ''}`} ref={scrollTargetRef}>
              <div className={styles['summary-title']}>
                AI Summary
              </div>

              <div className={`height-vh-68 scrollable-div height-100p justify-center`}>
                {
                  getFinalAiContent() ? <SearchableMarkdown markdownContent={getFinalAiContent()} /> : <Spinner size="3" className='self-center'></Spinner>
                }

                {selectedReport?.charts &&
                  <ImageContainer
                    images={selectedReport?.charts}
                  />
                }

                {selectedReport?.keywords &&
                  <Tags
                    header='Keywords:'
                    tags={selectedReport.keywords}
                  />}
              </div>
            </div>
          </> : <></>
      }


    </div>
  );
}

