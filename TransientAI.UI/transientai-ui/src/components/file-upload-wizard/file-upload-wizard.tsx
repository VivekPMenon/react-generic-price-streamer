'use client';

import { useMemo, useState } from 'react';
import styles from './file-upload-wizard.module.scss';
import { DataGrid } from '../data-grid';
import { ColDef } from 'ag-grid-community';
import { File, fileManagerService } from '@/services/file-manager';
import { useTranslation } from 'react-i18next'; // Import translation hook

export interface FileUploaderWizardProps {
  onUploadSuccess?: (file: File) => void;
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

export function FileUploadWizard({ onUploadSuccess }: FileUploaderWizardProps) {
  const { t } = useTranslation();  // Use the useTranslation hook
  const [stepId, setStepId] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
        <span className='step-title'>{t('file_upload_wizard.upload')}</span> {/* Translated Upload */}
        <span className='step-separator'></span>

        <span className={`step-number ${stepId === 2 ? 'active' : ''}`}>2</span>
        <span className='step-title'>{t('file_upload_wizard.review')}</span> {/* Translated Review */}
        <span className='step-separator'></span>

        <span className={`step-number ${stepId === 3 ? 'active' : ''}`}>3</span>
        <span className='step-title'>{t('file_upload_wizard.submit')}</span> {/* Translated Submit */}
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
            <span>{t('file_upload_wizard.drag_drop')}</span> {/* Translated Drag and drop files here */}
            <span>{t('file_upload_wizard.or')}</span> {/* Translated Or */}
            <input type='file' onChange={handleFileSelect} style={{ display: 'none' }} id='fileInput' />
            <label htmlFor='fileInput' className={styles['file-input-label']}>{t('file_upload_wizard.browse_file')}</label> {/* Translated Browse Your File */}
          </div>

          {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}

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
            <button className="secondary-button" onClick={() => setStepId(stepId - 1)}>{t('file_upload_wizard.back')}</button> {/* Translated Back */}
            <button className="button" onClick={uploadFile}>{t('file_upload_wizard.next')}</button> {/* Translated Next */}
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
            {t('file_upload_wizard.upload_successful')} {/* Translated Upload Successful */}
          </div>
          <div className='flex gap-3 justify-center'>
            <button className="button" onClick={() => setStepId(1)}>{t('file_upload_wizard.done')}</button> {/* Translated Done */}
          </div>
        </div>
      }

    </div>
  );
}
