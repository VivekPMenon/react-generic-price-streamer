import { useMemo, useState } from 'react';
import styles from './file-upload-wizard.module.scss';
import { DataGrid } from '../data-grid';
import { ColDef } from 'ag-grid-community';

export function FileUploadWizard() {

  const [stepId, setStepId] = useState<number>(1);

  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), [{}]);

  const mockData = [
    {
      "bond": "US Treasury 10Y",
      "isin": "US912828YV74",
      "securityName": "United States Treasury Bond 10 Year",
      "price": 102.45,
      "bid": 102.20,
      "mid": 102.35,
      "ask": 102.50,
      "currency": "USD",
      "maturityDate": "2033-05-15",
      "couponRate": 3.50,
      "yield": 3.75,
      "sector": "Government"
    },
    {
      "bond": "US Treasury 10Y",
      "isin": "US912828YV74",
      "securityName": "United States Treasury Bond 10 Year",
      "price": 102.45,
      "bid": 102.20,
      "mid": 102.35,
      "ask": 102.50,
      "currency": "USD",
      "maturityDate": "2033-05-15",
      "couponRate": 3.50,
      "yield": 3.75,
      "sector": "Government"
    }
  ];

  function getColumnDef(): ColDef[] {
    const columnDefs:ColDef[] = [
      {
        field: "bond",
        headerName: "Bond",
        width: 100,
        floatingFilter: false
      },
      {
        field: "isin",
        headerName: "ISIN",
        width: 100,
        floatingFilter: false
      },
      {
        field: "securityName",
        headerName: "Security Name",
        width: 230,
        floatingFilter: false
      },
      {
        field: "price",
        headerName: "Price",
        width: 100,
        floatingFilter: false
      },
      {
        field: "bid",
        headerName: "Bid",
        width: 100,
        floatingFilter: false
      },
      {
        field: "mid",
        headerName: "Mid",
        width: 100,
        floatingFilter: false
      },
      {
        field: "ask",
        headerName: "Ask",
        width: 100,
        floatingFilter: false
      },
      {
        field: "currency",
        headerName: "Currency",
        width: 100,
        floatingFilter: false
      }
    ];
    return columnDefs;
  }

  return (
    <div className={styles['file-uploader-container']}>

      <div className='wizard-steps mb-[10px]'>
        <span className={`step-number ${stepId === 1 ? 'active' : ''}`}>1</span>
        <span className='step-title'>Upload</span>
        <span className='step-separator'></span>

        <span className={`step-number ${stepId === 2 ? 'active' : ''}`}>2</span>
        <span className='step-title'>Review</span>
        <span className='step-separator'></span>

        <span className={`step-number ${stepId === 3 ? 'active' : ''}`}>3</span>
        <span className='step-title'>Submit</span>

      </div>

      {
        stepId === 1 &&
        <div className={styles['file-upload-step']}>
          <div className={styles['upload-area']}>
            Drag your file here
            <span>Or</span>
            <button className="secondary-button">Browse Your File</button>
          </div>

          <button className="button" onClick={() => setStepId(stepId + 1)}>Download Template</button>
        </div>
      }

      {
        stepId === 2 &&
        <div className={styles['file-validation-step']}>
          <DataGrid isSummaryGrid={true}
            rowData={mockData}
            columnDefs={columnDefs}
            rowSelection={'single'}>
          </DataGrid>

          <div className='flex gap-3 justify-center'>
            <button className="secondary-button" onClick={() => setStepId(stepId - 1)}>Back</button>
            <button className="button" onClick={() => setStepId(stepId + 1)}>Next</button>
          </div>
        </div>
      }

      {
        stepId === 3 && <div className={styles['file-submission-step']}>
          <div className={styles['upload-status']}>
            <span>
              <i className='fa-solid fa-check'></i>
            </span>
            Upload Succesful
          </div>
          <div className='flex gap-3 justify-center'>
            <button className="secondary-button" onClick={() => setStepId(1)}>Upload Another File</button>
            <button className="button" onClick={() => setStepId(1)}>Done</button>
          </div>
        </div>
      }

    </div>
  );
}