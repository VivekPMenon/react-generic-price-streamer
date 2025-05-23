'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './research-reports.module.scss';
import Segmented from 'rc-segmented';
import { SearchableMarkdown } from '@/components/markdown';
import {
  ReportSummary,
  ResearchReport,
  researchReportsDataService,
  useResearchReportsStore,
} from '@/services/reports-data';
import EmailViewer from '../email-parser/email-viewer';
import Tags from "@/components/tags/tags";
import ImageContainer from "@/components/image-container/image-container";
import { useScrollTo, useScrollToElementId } from '@/lib/hooks';
import { Spinner } from '@radix-ui/themes';
import { translateText } from '@/i18n'; // Import your translate function
import { useUserContextStore } from '@/services/user-context';

export interface ResearchReportsProps {
  isExpanded?: boolean;
}
interface TranslatedResearchReport extends ResearchReport {
  translatedName?: string;
}
// ✅ Enum with stable keys
export enum ReportType {
  Abstract = 'abstract',
  ExecutiveSummary = 'executive_summary',
  Detailed = 'detailed',
}

// ✅ Labels map for translation
export const ReportTypeLabels = {
  [ReportType.Abstract]: 'full_view',
  [ReportType.ExecutiveSummary]: 'executive_summary',
  [ReportType.Detailed]: 'detailed',
};

export function ResearchReports({ isExpanded }: ResearchReportsProps) {
  const { t } = useTranslation();
  const { scrollTargetRef } = useScrollTo<HTMLDivElement>();
  const { scrollToElementId } = useScrollToElementId();
  const { isLoading, reports, selectedReport, setSelectedReport } = useResearchReportsStore();

  const [searchedReports, setSearchedReports] = useState<ResearchReport[]>([]);
  const [isSummaryVisible, setIsSummaryVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchResultsLoading, setIsSearchResultsLoading] = useState<boolean>(false);

  const [emailContent, setEmailContent] = useState<string>('');
  const [executiveSummary, setExecutiveSummary] = useState<ReportSummary | null>(null);
  const [detailedSummary, setDetailedSummary] = useState<ReportSummary | null>(null);
  const [summaryType, setSummaryType] = useState<ReportType>(ReportType.ExecutiveSummary);

  const visibleReports = useMemo<ResearchReport[]>(() => {
    return searchedReports?.length ? searchedReports : reports;
  }, [searchedReports, reports]);

  useEffect(() => {
    if (selectedReport) onReportSelection(selectedReport);
  }, [selectedReport]);

  // Translate the titles of the reports dynamically
  //  const translateReportTitles = async (reports: ResearchReport[]) => {
  const translateReportTitles = async (reports: ResearchReport[]): Promise<TranslatedResearchReport[]> => {
    if (!reports.length) return [];
    const translatedReports = await Promise.all(
      reports
        .filter((report) => report.name) // filter out undefined names
        .map(async (report) => {
          const translatedTitle = await translateText(report.name!);
          // return { ...report, translatedName: translatedTitle };
          return { ...report, translatedName: translatedTitle } as ResearchReport & { translatedName: string };

        })
    );

    return translatedReports;
  };
  // const [translatedReports, setTranslatedReports] = useState<ResearchReport[]>([]);
  const [translatedReports, setTranslatedReports] = useState<TranslatedResearchReport[]>([]);

  useEffect(() => {
    const updateTranslatedReports = async () => {
      const translated = await translateReportTitles(visibleReports);
      setTranslatedReports(translated);
    };
    updateTranslatedReports();
  }, [visibleReports]);

  async function onReportSelection(report: ResearchReport) {
    if (!report?.id) return;

    setIsSummaryVisible(true);
    setSelectedReport(report);
    setExecutiveSummary(null);
    setDetailedSummary(null);
    scrollToElementId(report.id!);

    try {
      const userContext = useUserContextStore.getState().userContext;
      const emailContent = await researchReportsDataService.getEmailContentAsHtml(report.id!, userContext.userId!);
      setEmailContent(emailContent);

      // it has to be done sequentially due to the AI engine limitation 
      if (summaryType === ReportType.ExecutiveSummary) {
        let aiSummary = await researchReportsDataService.getAiSummary(report.id!, ReportType.ExecutiveSummary, userContext.userId!);
        setExecutiveSummary(aiSummary);

        aiSummary = await researchReportsDataService.getAiSummary(report.id!, ReportType.Detailed, userContext.userId!);
        setDetailedSummary(aiSummary);
      } else {
        let aiSummary = await researchReportsDataService.getAiSummary(report.id!, ReportType.Detailed, userContext.userId!);
        setDetailedSummary(aiSummary);

        aiSummary = await researchReportsDataService.getAiSummary(report.id!, ReportType.ExecutiveSummary, userContext.userId!);
        setExecutiveSummary(aiSummary);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  }

  async function searchReports(event: React.KeyboardEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value;
    if (event.key !== "Enter") return;

    if (inputValue === '') {
      setSearchedReports([]);
      return;
    }

    setIsSearchResultsLoading(true);
    const searchedReports = await researchReportsDataService.searchReports(inputValue);
    setIsSearchResultsLoading(false);
    setSearchedReports(searchedReports);
  }

  const finalAiContent = summaryType === ReportType.ExecutiveSummary
    ? executiveSummary
    : detailedSummary;

  return (
    <div className={styles['research-reports']}>
      <div className={styles['reports-container']}>

        <div className={styles['filter-panel']}>
          {t('search')}:

          <div className={styles['search-box']}>
            <input
              type='text'
              className='mb-2'
              autoFocus={true}
              autoComplete='on'
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              onKeyDown={searchReports}
            />
            {searchQuery ?
              <i className='fa-solid fa-remove' onClick={() => { setSearchQuery(''); setSearchedReports([]); }}></i> :
              <i className='fa-solid fa-magnifying-glass'></i>}
          </div>

          {t('summary_type')}:
          <Segmented
            className={styles['format-type']}
            value={summaryType}
            options={[
              { label: t(ReportTypeLabels[ReportType.ExecutiveSummary]), value: ReportType.ExecutiveSummary },
              { label: t(ReportTypeLabels[ReportType.Abstract]), value: ReportType.Abstract }
            ]}
            onChange={(value: ReportType) => setSummaryType(value)}
          />
        </div>

        <div className={`${styles['reports']} news scrollable-div`}>
          {isLoading || isSearchResultsLoading ?
            <Spinner size="3" className='self-center' /> :
            <>
              {translatedReports.map(report => (
                <div
                  key={report.id}
                  id={report.id}
                  className={report.name === selectedReport?.name ? 'news-item active' : 'news-item'}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className='news-content'>
                    <div className='news-title'>
                      <i className='fa-regular fa-file-lines'></i>
                      {report.translatedName || report.name}
                    </div>
                    {report.concise_summary &&
                      <div className='news-description'>
                        <div>{report.concise_summary}</div>
                      </div>}
                  </div>
                </div>
              ))}
            </>
          }
        </div>
      </div>

      {isSummaryVisible &&
        <>
          <div className={`${styles['email-content']} ${isExpanded ? styles['expanded'] : ''}`}>
            <div className={styles['summary-title']}>
              {t('original_email')}
            </div>
            <EmailViewer className='height-vh-67' emailHtml={emailContent} />
          </div>

          <div className={`${styles['ai-summary']} ${isExpanded ? styles['expanded'] : ''}`}>
            <div className={styles['summary-title']}>
              {t(ReportTypeLabels[summaryType])}
            </div>

            <div className='height-vh-67 justify-center scrollable-div' ref={scrollTargetRef}>
              <div>
                {finalAiContent
                  ? <SearchableMarkdown markdownContent={finalAiContent.content} />
                  : <Spinner size="3" className='self-center' />}
              </div>

              {finalAiContent?.images && <ImageContainer images={finalAiContent.images} />}

              {selectedReport?.keywords && <Tags header={t('keywords')} tags={selectedReport.keywords} />}
            </div>
          </div>
        </>
      }
    </div>
  );
}
