'use client';

import { useEffect, useMemo, useRef, memo } from 'react';
import { calculateFileSize, DataGrid } from '../data-grid';
import { ColDef, GridApi } from 'ag-grid-community';
import { FileUploadWizard } from '../file-upload-wizard/file-upload-wizard';
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { themePlugin } from "@react-pdf-viewer/theme";
import { useScrollTo } from '@/lib/hooks';
import { useRiskReportsSlice } from "@/services/reports-data";
import { EmailFormPopup } from "@/components/risk-reports/email-form-popup";
import styles from './risk-reports-uploader.module.scss';

const EMPTY = new Uint8Array(0);

function RiskReportsUploader() {
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

  const columnDefs = useMemo<ColDef[]>(() => {
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
        minWidth: 120,
        autoHeight: true,
        valueFormatter: params => calculateFileSize(params.value)
      },
      {
        field: 'upload_date',
        headerName: 'Date',
        minWidth: 200,
        sort: 'desc',
        cellClass: 'date-cell', // Optional: Apply date styling
        autoHeight: true,
        wrapText: true,
        valueFormatter: (params) => {
          if (!params.value) {
            return '';
          }
          const date = new Date(params.value);
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
        }
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
  }, [deleteFile, downloadFile, emailFile]);

  useEffect(() => {
    if(!gridApiRef) {
      return;
    }

    gridApiRef?.current?.forEachNode((node) => 
      node.setSelected(node.data && node.data?.id === selectedReport?.id)
    );
  }, [selectedReport]);

  function handleRowSelection(event: any) {
    setSelectedReport(event.data!.id);
    scrollToTarget();
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

export default memo(RiskReportsUploader);