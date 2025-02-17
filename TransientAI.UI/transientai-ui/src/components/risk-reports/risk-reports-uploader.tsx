import React, { useEffect, useMemo, useState } from 'react';
import styles from './risk-reports-uploader.module.scss';
import { DataGrid } from '../data-grid';
import { ColDef } from 'ag-grid-community';
import { RiskReport } from '@/services/reports-data';
import { getRiskReports } from '@/services/reports-data/risk-reports-data';
import { FileUploadWizard } from './file-upload-wizard';

export function RiskReportsUploader() {

  const [riskReports, setRiskReports] = useState<RiskReport[]>();
  const [fileName, setFileName] = useState('');

  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);

  useEffect(() => loadRiskReports(), []);

  function loadRiskReports() {
    const loadDataAsync = async () => {
      const reports = await getRiskReports();
      setRiskReports(reports);
    }

    loadDataAsync();
  }

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'First Name,Age\n'; // CSV Headers
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'portfolio',
        headerName: 'Report Name',
        width: 150,
      },
      {
        field: 'uploadedBy',
        headerName: 'Uploaded By',
        width: 130,
      },
      {
        field: 'uploadStatus',
        headerName: 'Upload Status',
        width: 150,
      },
      {
        field: 'date',
        headerName: 'Date',
        width: 120,
        sort: 'desc',
        cellClass: 'date-cell', // Optional: Apply date styling
      },
      {
        field: '',
        headerName: '',
        width: 200,
        cellRenderer:(params:any) => (<div className='gap-5 flex fs-14 '>
          <i className='fa-regular fa-envelope cursor-pointer'></i>
          <i className='fa-regular fa-circle-down cursor-pointer'></i>
          <i className='fa-regular fa-share-from-square cursor-pointer'></i>
          <i className='fa-regular fa-trash-can cursor-pointer'></i>
        </div>)
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
    <div className={styles['risk-reports-uploader']}>
      <FileUploadWizard onUploadSuccess={newFile => setRiskReports([...riskReports!, newFile])}></FileUploadWizard>

      <div className={styles['reports-grid']}>
        {/* <div className='filter-panel'>
          Search:
          <input type='text' className='mb-2'></input>
        </div> */}

        My Documents

        <DataGrid isSummaryGrid={true}
          rowData={riskReports}
          columnDefs={columnDefs}>
        </DataGrid>
      </div>
    </div>

  );
}
