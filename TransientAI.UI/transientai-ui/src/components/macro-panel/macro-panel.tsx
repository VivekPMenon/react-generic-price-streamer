import { useMacroPanelDataStore } from "@/services/macro-panel-data/macro-panel-data-store";
import { Spinner } from "@radix-ui/themes";
import EmailViewer from "../email-parser/email-viewer";
import styles from './macro-panel.module.scss';
import { formatDate } from "@/lib/utility-functions/date-operations";
import { useEffect, useState } from "react";
import { BloombergEmailReport } from "@/services/macro-panel-data/model";

export function MacroPanel() {
  const { bloombergEmailReports, isLoading, selectedReport, setSelectedReport } = useMacroPanelDataStore();

  if (isLoading) {
    return <Spinner size={"3"}></Spinner>;
  }

  return (
    <div className={`${styles['macro-panel']}`}>

      <div className={styles['bloomberg-report']}>
        <EmailViewer
          hideSearch={true}
          className={`${styles['email-viewer']} scrollable-div email-container-dark`}
          emailHtml={selectedReport?.html_content}></EmailViewer>
      </div>

      <div className={styles['previous-reports']}>
        <div className="sub-header">All Reports</div>
        <div className='news'>
          {
            bloombergEmailReports?.map(report =>
              <div className={`news-item ${report.received_date === selectedReport?.received_date ? 'active' : ''}`} onClick={e => setSelectedReport(report)}>
                <div className='news-content'>
                  <div className='news-title'>
                    {report.subject}
                  </div>
                  <div className='news-description'>
                    {formatDate(report.received_date)}
                  </div>
                </div>
              </div>
            )
          }
        </div>

      </div>
    </div>
  );
}