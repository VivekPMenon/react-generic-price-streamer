'use client';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styles from './research-reports.module.scss';
import Segmented from 'rc-segmented';
import { SearchableMarkdown } from '@/components/markdown';
import {
  researchReportsDataService,
  ResearchReport,
  useResearchReportsStore,
  ReportSummary
} from '@/services/reports-data';
import EmailViewer from '../email-parser/email-viewer';
import Tags from "@/components/tags/tags";
import ImageContainer from "@/components/image-container/image-container";
import { useScrollTo, useScrollToElementId } from '@/lib/hooks';
import { Spinner } from '@radix-ui/themes';


export interface ResearchReportsProps {
  isExpanded?: boolean;
}

export function ResearchReports({ isExpanded }: ResearchReportsProps) {

  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>();
  const { scrollToElementId } = useScrollToElementId();

  const { isLoading, reports, selectedReport, setSelectedReport } = useResearchReportsStore();

  const [searchedReports, setSearchedReports] = useState<ResearchReport[]>([]);
  const [isSummaryVisible, setIsSummaryVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchResultsLoading, setIsSearchResultsLoading] = useState<boolean>(false);

  const [emailContent, setEmailContent] = useState<string>('');
  const [aiContentAbstract, setAiContentAbstract] = useState<ReportSummary|null>(null);
  const [aiContentDetailed, setAiContentDetailed] = useState<ReportSummary|null>(null);
  const [summaryType, setSummaryType] = useState<'Executive Summary' | 'Verbose'>('Executive Summary');

  const visibleReports = useMemo<ResearchReport[]>(
      () => {
        if (searchedReports?.length) {
          return searchedReports;
        }

        return reports;
      }, [searchedReports, reports]);

  const onReportSelection = useCallback(function(report: ResearchReport) {
  // function onReportSelection(report: ResearchReport) {
    if (!report?.id) {
      return;
    }

    setIsSummaryVisible(true);
    setSelectedReport(report);
    // setEmailContent('');
    setAiContentAbstract(null);
    setAiContentDetailed(null);

    // purposefully keeping sequential as the AISummary call takes too much time sometimes
    researchReportsDataService
        .getEmailContentAsHtml(report.id!)
        .then(emailContent => {
          setEmailContent(emailContent);
          scrollToTarget();

          Promise.allSettled([
                researchReportsDataService.getAiSummaryExecutive(report.id!)
                    .then(aiContentAbstract => setAiContentAbstract(aiContentAbstract)),
                researchReportsDataService.getAiSummaryDetailed(report.id!)
                    .then(aiContentDetails => setAiContentDetailed(aiContentDetails))
              ]
          ).then(() => scrollToElementId(report.id!));
        });
  }, []);

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

  const finalAiContent = summaryType === 'Executive Summary'
     ? aiContentAbstract
     : aiContentDetailed;

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
              searchQuery ? <i className='fa-solid fa-remove' onClick={() => {
                setSearchQuery('');
                setSearchedReports([])
              }}></i> : <i className='fa-solid fa-magnifying-glass'></i>
            }

          </div>

          Summary Type:
          <Segmented
            className={styles['format-type']}
            value={summaryType}
            options={['Executive Summary', 'Verbose']}
            onChange={(value: any) => { setSummaryType(value) }}
          />
        </div>

        <div className={`${styles['reports']} height-vh-63 news scrollable-div`}>
          {
            isLoading || isSearchResultsLoading ?
              <Spinner size="3" className='self-center'></Spinner>
              :
              <>
                {
                  visibleReports.map(report =>
                    <div key={report.id} id={report.id} className={report.name === selectedReport?.name ? 'news-item active' : 'news-item'}
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
                <EmailViewer className='height-vh-70' emailHtml={emailContent} />
              </div>
            </div>

            <div className={`${styles['ai-summary']} ${isExpanded ? styles['expanded'] : ''}`} ref={scrollTargetRef}>
              <div className={styles['summary-title']}>
                AI Summary
              </div>

              <div className={`height-vh-70 justify-center scrollable-div `}>
                <div >
                {
                  finalAiContent
                      ? <SearchableMarkdown
                          markdownContent={finalAiContent.content}
                      />
                      : <Spinner size="3" className='self-center'></Spinner>
                }
                </div>
                {finalAiContent?.images &&
                    <ImageContainer
                        images={finalAiContent.images}
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

