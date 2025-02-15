'use client';

import { RiskReport } from '@/services/reports-data';
import { DataGrid } from '../data-grid';
import styles from './risk-reports.module.scss';
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { useEffect, useState } from 'react';
import { getRiskReports } from '@/services/reports-data/risk-reports-data';

export function RiskReports() {

  const [riskReports, setRiskReports] = useState<RiskReport[]>();
  const [columnDefs] = useState<ColDef[]>(getColumnDef());
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => { loadRiskReports() }, []);

  async function loadRiskReports() {
    const reports = await getRiskReports();
    setRiskReports(reports);
  }

  function onRowDoubleClicked(event: RowDoubleClickedEvent<RiskReport>) {

  }

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'portfolio',
        headerName: 'Portfolio',
        width: 200,
      },
      {
        field: 'reportType',
        headerName: 'Report Type',
        width: 200,
      },
      {
        field: 'date',
        headerName: 'Date',
        width: 120,
        cellClass: 'date-cell', // Optional: Apply date styling
      }
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
          onRowDoubleClicked={onRowDoubleClicked} >
        </DataGrid>
      </div>
      <div className={styles['pdf-viewer']}>
        PDF viewer
      </div>

    </div>
  )
}