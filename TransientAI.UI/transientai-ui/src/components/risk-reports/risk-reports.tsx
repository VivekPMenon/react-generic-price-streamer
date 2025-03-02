'use client';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { RiskReport } from '@/services/reports-data';
import { themePlugin } from '@react-pdf-viewer/theme';
import { DataGrid } from '../data-grid';
import styles from './risk-reports.module.scss';
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getRiskReports } from '@/services/reports-data/risk-reports-data';
import { useScrollTo } from '@/lib/hooks';

export function RiskReports() {

  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>(-200);

  const [riskReports, setRiskReports] = useState<RiskReport[]>();
  const [selectedReport, setSelectedReport] = useState<RiskReport>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);

  useEffect(() => loadRiskReports(), []);

  function  loadRiskReports() {
    const loadDataAsync = async () => {
      const reports = await getRiskReports();
      setRiskReports(reports);
    }

    loadDataAsync();
  }

  function onRowSelection(event: any) {
    setSelectedReport(event.data!);
  }

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'portfolio',
        headerName: 'Portfolio',
        width: 140,
      },
      {
        field: 'reportType',
        headerName: 'Report Type',
        width: 150,
      },
      {
        field: 'date',
        headerName: 'Date',
        width: 150,
        cellClass: 'date-cell', // Optional: Apply date styling
      },
      // {
      //   headerName: '',
      //   width: 100,
      //   floatingFilter: false,
      //   cellRenderer: IconCellRenderer,
      //   cellRendererParams: {
      //     className: 'fa-solid fa-eye',
      //     onClickHandler: () => alert('hey') 
      //   }
      // }
    ];
  }

  return (
    <div className={styles['risk-reports']}>
      <div className={styles['reports-grid']}>
        <div className='filter-panel'>
          Search:
          <input type='text' className='mb-2' value={searchQuery} onChange={event => setSearchQuery(event.target.value)}></input>
        </div>

        <DataGrid isSummaryGrid={true}
          rowData={riskReports}
          columnDefs={columnDefs}
          onRowDoubleClicked={onRowSelection}
          onRowClicked={onRowSelection} 
          rowSelection={'single'}>
        </DataGrid>
      </div>

      {/* display none is used because viewer plugin was causing render issues with conditional rendering */}
      <div className={styles['pdf-viewer']} style={{ display: selectedReport.pdfSource ? 'flex' : 'none' }} ref={scrollTargetRef}>
        {/* todo...load pdf worker from a local folder, also create a common component for pdf viewer */}
        <div className='summary-title'>Original Report</div>

        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={selectedReport.pdfSource ? selectedReport.pdfSource : '/pdfs/MSIConcentrated.pdf'}
            defaultScale={1.25}
            plugins={[defaultLayoutPlugin(), themePlugin()]}
            theme={'dark'}
            onDocumentLoad={() => scrollToTarget()}
          />
        </Worker>
      </div>

    </div>
  )
}