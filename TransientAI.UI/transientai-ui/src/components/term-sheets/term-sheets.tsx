import {useEffect, useMemo, useRef} from 'react';
import styles from './term-sheets.module.scss';
import {FileUploadWizard} from "@/components/file-upload-wizard/file-upload-wizard";
import { File } from '@/services/file-manager';
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {defaultLayoutPlugin} from "@react-pdf-viewer/default-layout";
import {themePlugin} from "@react-pdf-viewer/theme";
import {calculateFileSize, DataGrid} from "@/components/data-grid";
import {ColDef, GridApi} from "ag-grid-community";
import {useRiskReportsSlice} from "@/services/reports-data";

const EMPTY = new Uint8Array(0);

export function TermSheets() {
    const gridApiRef = useRef<GridApi | null>(null);
    const iframeRef = useRef<any>(null);
    const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);
    const {
        isLoading,
        riskReports,
        setSelectedReport,
        selectedReport,
        loadRiskReports
    } = useRiskReportsSlice();

    useEffect(() => {
        const handleIframeLoad = () => {
            const iframe = iframeRef.current;
            const iframeWindow = iframe.contentWindow;
            const name = iframeWindow.document.querySelector('#name');
            if (name) {
                name.value = 'user01';
            }

            const password = iframeWindow.document.querySelector('#password');
            if (password) {
                password.value = 'Password@123';
            }

            const button = iframeWindow.document.querySelector('button[type="submit"]');
            if (button) {
                button.click();
            }
        };

        const iframe = iframeRef.current;
        iframe.addEventListener('load', handleIframeLoad);

        return () => {
            iframe.removeEventListener('load', handleIframeLoad);
        };
    }, []);

    function handleRowSelection(event: any) {
        setSelectedReport(event.data!.id);
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
                minWidth: 120,
                autoHeight: true,
                valueFormatter: params => calculateFileSize(params.value)
            },
            {
                field: 'upload_date',
                headerName: 'Date',
                minWidth: 120,
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
            }
        ];
    }

    return (
        <div className={styles['term-sheets-container']}>
            <div className={styles['term-sheets-documents']}>
                <div className={styles['term-sheets-uploader']}>
                    <FileUploadWizard onUploadSuccess={(file: File) => {
                        if (file?.id) {
                            setSelectedReport(file.id);
                        }
                        loadRiskReports()
                            .then(() => {
                                // do nothing
                            });
                    }} />
                </div>

                <div className={styles['term-sheets-grid']}>
                    <div>My Documents</div>
                    <DataGrid
                        ref={gridApiRef}
                        isSummaryGrid={true}
                        rowData={riskReports}
                        loading={isLoading}
                        columnDefs={columnDefs}
                        rowSelection={'single'}
                        onRowDoubleClicked={handleRowSelection}
                    >
                    </DataGrid>
                </div>

                <div className={styles['term-sheets-preview-container']}>
                    <div className={styles['term-sheets-preview']} style={{ display: selectedReport ? 'flex' : 'none' }}>
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

            <div className={styles['term-sheets-site-container']}>
                <iframe
                    ref={iframeRef}
                    src='https://d2mbreeg83asqt.cloudfront.net/'
                    className={styles['term-sheets-site']}
                />
            </div>
        </div>
    );
}