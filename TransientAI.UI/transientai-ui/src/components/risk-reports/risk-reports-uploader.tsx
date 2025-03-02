'use client';

import { useEffect, useMemo, useRef } from 'react';
import { calculateFileSize, DataGrid } from '../data-grid';
import { ColDef, GridApi } from 'ag-grid-community';
import { FileUploadWizard } from './file-upload-wizard';
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { themePlugin } from "@react-pdf-viewer/theme";
import { useScrollTo } from '@/lib/hooks';
import { useRiskReportsSlice } from "@/services/reports-data";
import { EmailFormPopup } from "@/components/risk-reports/email-form-popup";
import styles from './risk-reports-uploader.module.scss';

const EMPTY = new Uint8Array(0);

export function RiskReportsUploader() {
  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>();
  const gridApiRef = useRef<GridApi | null>(null);

  const {
    isLoading,
    riskReports,
    selectedReport,
    setSelectedReport,
    deleteFile,
    downloadFile,
    loadRiskReports,
    emailFile
  } = useRiskReportsSlice();

  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);

  useEffect(() => {
    if(!gridApiRef) {
      return;
    }

    gridApiRef?.current?.forEachNode((node) => 
      node.setSelected(node.data && node.data?.filename === selectedReport?.filename)
    );
  }, [selectedReport, gridApiRef?.current]);

  function handleRowSelection(event: any) {
    setSelectedReport(event.data!.filename);
    scrollToTarget();
  }

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'filename',
        headerName: 'File Name',
        width: 300,
        autoHeight: true,
        wrapText: true
      },
      {
        field: 'size',
        headerName: 'Size',
        width: 120,
        autoHeight: true,
        valueFormatter: params => calculateFileSize(params.value)
      },
      {
        field: 'upload_date',
        headerName: 'Date',
        width: 120,
        sort: 'desc',
        cellClass: 'date-cell', // Optional: Apply date styling
        autoHeight: true
      },
      {
        field: '',
        headerName: '',
        width: 200,
        autoHeight: true,
        cellRenderer: (params: any) => (<div className='gap-5 flex fs-14 '>
          <EmailFormPopup file={params.data} sendEmail={emailFile}>
            <i className='fa-regular fa-envelope cursor-pointer' />
          </EmailFormPopup>
          <i className='fa-regular fa-circle-down cursor-pointer' onClick={() => downloadFile(params.data)} />
          <i className='fa-regular fa-share-from-square ' />
          <i className='fa-regular fa-trash-can cursor-pointer' onClick={() => deleteFile(params.data)} />
        </div>)
      }
    ];
  }

  return (
    <div className={styles['risk-reports-container']}>
      <div className={styles['risk-reports-documents']}>
        <div className={styles['risk-reports-uploader']}>
          <FileUploadWizard onUploadSuccess={() => loadRiskReports()} />
        </div>

        <div className={styles['reports-grid']}>
          <div>My Documents</div>
          <DataGrid
            ref={gridApiRef}
            isSummaryGrid={true}
            rowData={riskReports}
            loading={isLoading}
            columnDefs={columnDefs}
            onRowDoubleClicked={handleRowSelection}
            rowSelection={'single'}
          >
          </DataGrid>
        </div>
      </div>

      <div className={styles['risk-reports-preview-container']}>
        <div className={styles['risk-reports-preview']} style={{ display: selectedReport ? 'flex' : 'none' }} ref={scrollTargetRef}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl={selectedReport ? selectedReport.fileUrl : EMPTY}
              defaultScale={1.25}
              plugins={[defaultLayoutPlugin(), themePlugin()]}
              theme={'dark'}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}
