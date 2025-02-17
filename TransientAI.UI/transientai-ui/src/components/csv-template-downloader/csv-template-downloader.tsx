import React from 'react';

export interface CsvTemplateDownloaderProps {
  columns?: string[];
  sampleData?: any;
}

const CsvTemplateDownloader = ({ columns, sampleData }: CsvTemplateDownloaderProps) => {
  
  const downloadCsvTemplate = () => {
    if (!columns || columns.length === 0) {
      alert('No columns configured!');
      return;
    }

    const csvRows = [];
    csvRows.push(columns.join(','));

    if (sampleData && sampleData.length > 0) {
      sampleData.forEach((row:any) => {
        csvRows.push(columns.map((col: any) => row[col] || '').join(','));
      });
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className='button' style={{width: '130px'}} onClick={downloadCsvTemplate}>
      Download Template
    </button>
  );
};

export default CsvTemplateDownloader;
