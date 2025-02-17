import { useMemo, useState } from 'react';
import styles from './file-upload-wizard.module.scss';
import { DataGrid } from '../data-grid';
import { ColDef } from 'ag-grid-community';
import Papa from 'papaparse';
import CsvTemplateDownloader from '../csv-template-downloader/csv-template-downloader';
import { RiskReport } from '@/services/reports-data';
import { getCurrentDate } from '@/lib/utility-functions/date-operations';

export interface FileUploaderWizardProps {
  onUploadSuccess?:(newFile: RiskReport) => void;
}

export function FileUploadWizard({onUploadSuccess}: FileUploaderWizardProps) {

  const [stepId, setStepId] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>({});
  const [jsonData, setJsonData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), [{}]);

  const csvColumns = ['Bond', 'ISIN', 'Security Name', 'Price', 'Bid', 'Mid', 'Ask', 'Currency', 'Maturity Date', 'Coupon Rate', 'Yield', 'Sector'];
  const sampleRows = [
    { 'Bond': 'US Treasury 10Y', 'ISIN': 'US912828YV74', 'Security Name': 'United States Treasury Bond 10 Year', 'Price': 102.45, 'Bid': 102.20, 'Mid': 102.35, 'Ask': 102.50, 'Currency': 'USD', 'Maturity Date': '2033-05-15', 'Coupon Rate': 3.50, 'Yield': 3.75, 'Sector': 'Government' },
    { 'Bond': 'US Treasury 5Y', 'ISIN': 'US912828ZJ47', 'Security Name': 'United States Treasury Bond 5 Year', 'Price': 98.75, 'Bid': 98.50, 'Mid': 98.63, 'Ask': 98.80, 'Currency': 'USD', 'Maturity Date': '2028-10-15', 'Coupon Rate': 2.75, 'Yield': 3.10, 'Sector': 'Government' },
    { 'Bond': 'Corporate Bond A', 'ISIN': 'US4592001014', 'Security Name': 'High Yield Corporate Bond A', 'Price': 105.25, 'Bid': 105.00, 'Mid': 105.12, 'Ask': 105.30, 'Currency': 'USD', 'Maturity Date': '2030-06-20', 'Coupon Rate': 4.20, 'Yield': 4.50, 'Sector': 'Corporate' },
    { 'Bond': 'US Treasury 10Y', 'ISIN': 'US912828YV74', 'Security Name': 'United States Treasury Bond 10 Year', 'Price': 102.45, 'Bid': 102.20, 'Mid': 102.35, 'Ask': 102.50, 'Currency': 'USD', 'Maturity Date': '2033-05-15', 'Coupon Rate': 3.50, 'Yield': 3.75, 'Sector': 'Government' },
    { 'Bond': 'US Treasury 5Y', 'ISIN': 'US912828ZJ47', 'Security Name': 'United States Treasury Bond 5 Year', 'Price': 98.75, 'Bid': 98.50, 'Mid': 98.63, 'Ask': 98.80, 'Currency': 'USD', 'Maturity Date': '2028-10-15', 'Coupon Rate': 2.75, 'Yield': 3.10, 'Sector': 'Government' },
    { 'Bond': 'Corporate Bond A', 'ISIN': 'US4592001014', 'Security Name': 'High Yield Corporate Bond A', 'Price': 105.25, 'Bid': 105.00, 'Mid': 105.12, 'Ask': 105.30, 'Currency': 'USD', 'Maturity Date': '2030-06-20', 'Coupon Rate': 4.20, 'Yield': 4.50, 'Sector': 'Corporate' }
  ];

  function handleDragEnter(e: any) {
    e.preventDefault();
    setIsDragging(true);
  }
  
  function handleDragOver(e: any) {
    e.preventDefault();
  }
  
  function handleDragLeave(e: any) {
    e.preventDefault();
    setIsDragging(false);
  }
  
  function handleDrop(e: any) {
    e.preventDefault();
    setIsDragging(false);
  
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }
  
  function handleFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;
  
    setSelectedFile(file);
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        setJsonData(result.data);
        setStepId(stepId + 1);
      },
      error: function (error: any) {
        setErrorMessage(error.message);
      }
    });
  }
  
  function handleFiles(files: any) {
    if (files.length > 0) {
      setSelectedFile(files);
      setErrorMessage('');
    } else {
      setErrorMessage('No files selected.');
    }
  }
  
  function uploadFile() {
    setStepId(stepId + 1);
    onUploadSuccess!({
      date: getCurrentDate(),
      uploadedBy: 'John Doe',
      uploadStatus: 'Submitted to MSCI',
      portfolio: selectedFile?.name!
    });
  }

  function getColumnDef(): ColDef[] {
    const columnDefs: ColDef[] = [
      {
        field: "Bond",
        headerName: "Bond",
        width: 100,
        floatingFilter: false
      },
      {
        field: "ISIN",
        headerName: "ISIN",
        width: 100,
        floatingFilter: false
      },
      {
        field: "Security Name",
        headerName: "Security Name",
        width: 230,
        floatingFilter: false
      },
      {
        field: "Price",
        headerName: "Price",
        width: 100,
        floatingFilter: false
      },
      {
        field: "Bid",
        headerName: "Bid",
        width: 100,
        floatingFilter: false
      },
      {
        field: "Mid",
        headerName: "Mid",
        width: 100,
        floatingFilter: false
      },
      {
        field: "Ask",
        headerName: "Ask",
        width: 100,
        floatingFilter: false
      },
      {
        field: "Currency",
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
          <div
            className={`${styles['upload-area']} ${styles['drop-zone']} ${isDragging ? styles['drag-active'] : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            Drag and drop files here
            <span>Or</span>
            <input type='file' onChange={handleFileSelect} style={{ display: 'none' }} id='fileInput' />
            <label htmlFor='fileInput' className={styles['file-input-label']}>Browse Your File</label>
          </div>

          {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}

          {/* we will proceed to the next step with a preview of the uploaded file. user can hit back button if they lke to upload new one */}
          {/* {selectedFiles.length > 0 && (
            <div className='gap-3 justify-center'>
              <h2>Selected File:</h2>
              <ul>
                {selectedFiles.map((file: any, index: number) => (
                  <li key={file.name}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Cross1Icon
                        color='red'
                        width='10'
                        height='10'
                        onClick={() => handleDeleteFile(index)}
                      />
                      &nbsp;<span style={{ fontSize: '10px' }}>{file.name} ({file.size} bytes)</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )} */}

          <div className='flex gap-3 justify-center'>
            <CsvTemplateDownloader columns={csvColumns} sampleData={sampleRows}></CsvTemplateDownloader>
          </div>
        </div>
      }

      {
        stepId === 2 &&
        <div className={styles['file-validation-step']}>
          <DataGrid isSummaryGrid={true}
            rowData={jsonData}
            columnDefs={columnDefs}
            rowSelection={'single'}>
          </DataGrid>

          <div className='flex gap-3 justify-center'>
            <button className="secondary-button" onClick={() => setStepId(stepId - 1)}>Back</button>
            <button className="button" onClick={uploadFile}>Next</button>
          </div>
        </div>
      }

      {
        stepId === 3 &&
        <div className={styles['file-submission-step']}>
          <div className={styles['upload-status']}>
            <span>
              <i className='fa-solid fa-check'></i>
            </span>
            Upload Successful
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