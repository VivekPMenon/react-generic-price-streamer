import { useMemo, useState } from 'react';
import styles from './file-upload-wizard.module.scss';
import { DataGrid } from '../data-grid';
import { ColDef } from 'ag-grid-community';
import { File, fileManagerService } from '@/services/file-manager';

export interface FileUploaderWizardProps {
  onUploadSuccess?:(file: File) => void;
}

function getColumnDef(): ColDef[] {
  return [
    {
      field: "filename",
      headerName: "Name",
      width: 400,
      floatingFilter: false
    },
    {
      field: "size",
      headerName: "Size",
      width: 200,
      floatingFilter: false
    }
  ];
}

export function FileUploadWizard({onUploadSuccess}: FileUploaderWizardProps) {
  const [stepId, setStepId] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File|null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), [{}]);

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

    const files = Array.from(e.dataTransfer.files) as any[];
    if (files && files.length === 1 && files.every((file: any) => file.type === 'application/pdf')) {

      const newFile: File = {
        filename: files[0].name,
        size: files[0].size,
        native_file: files[0]
      };
      setSelectedFile(newFile);
      setSelectedFiles([newFile]);
      setErrorMessage('');
      setStepId(stepId + 1);
    }
  }
  
  function handleFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      return;
    }

    const newFile = {
      filename: file.name,
      size: file.size,
      native_file: file
    };
    setSelectedFile(newFile);
    setSelectedFiles([newFile]);
    setErrorMessage('');
    setStepId(stepId + 1);
  }

  function uploadFile() {
    if (!selectedFile) {
      return;
    }
    setStepId(stepId + 1);
    fileManagerService
        .uploadFile(selectedFile)
        .then(() => {
          setSelectedFiles([]);
          setSelectedFile(null);
          onUploadSuccess!(selectedFile);
        })
        .catch(e => {
          setErrorMessage(e.message);
        });
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
            <span>Drag and drop files here</span>
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
          )}

          <div className='flex gap-3 justify-center'>
            <CsvTemplateDownloader columns={csvColumns} sampleData={sampleRows}></CsvTemplateDownloader>
          </div>*/}
        </div>
      }

      {
        stepId === 2 &&
        <div className={styles['file-validation-step']}>
          <DataGrid isSummaryGrid={true}
            className={styles['grid']}
            rowData={selectedFiles}
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
            <button className="button" onClick={() => setStepId(1)}>Done</button>
          </div>
        </div>
      }

    </div>
  );

}