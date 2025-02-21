'use client'

import styles from './investor-relations.module.scss';
import React, {useEffect, useMemo, useState} from 'react';
import {DataGrid} from "@/components/data-grid";
import {getInquiries, InquiryRequest} from "@/services/investor-relations-data";
import {ColDef} from "ag-grid-community";

export interface InvestorRelationsProps {
}

function getColumnDef(): ColDef[] {
    return [
        {
            field: 'date',
            headerName: 'Date',
            width: 100,
            cellClass: 'date-cell',
            cellStyle: {
                "display": "flex",
                "align-items": "flex-start"
            }
        },
        {
            field: 'inquiredBy',
            headerName: 'From',
            width: 100,
            cellStyle: {
                "display": "flex",
                "align-items": "flex-start"
            }
        },
        {
            field: 'subject',
            headerName: 'Subject',
            width: 250,
            cellStyle: {
                "display": "flex",
                "align-items": "flex-start"
            }
        },
        {
            field: 'request',
            headerName: 'Inquiry/Request',
            width: 500,
            maxWidth: 500,
            wrapText: true,
            autoHeight: true,
            cellStyle: {
                "display": "flex",
                "align-items": "flex-start"
            }
        },
        {
            headerName: 'Action',
            width: 150,
            cellRenderer:(params:any) => {
                return (
                    <div className={styles['action-cell']}>
                        <i className='fa-regular fa-3x fa-file' style={{ marginRight: '4px' }}></i>
                    </div>
                );
            },
            cellStyle: {
                "display": "flex",
                "align-items": "flex-start"
            }
        },
        {
            field: 'statuses',
            headerName: 'Status',
            width: 150,
            autoHeight: true,
            cellRenderer:(params:any) => {
                return (
                    <div className={styles['status-icons']}>
                        <span><i className='fa-regular fa-check-circle'></i> Completed</span>
                        <span><i className='fa-regular fa-check-circle'></i> Attached 2 items</span>
                        <span><i className='fa-regular fa-check-circle'></i> Response</span>
                    </div>
                );
            },
            cellStyle: {
                "display": "flex",
                "align-items": "flex-start"
            }
        },
        {
            field: 'edited',
            headerName: 'Date edited',
            width: 100,
            cellClass: 'date-cell',
            cellStyle: {
                "display": "flex",
                "align-items": "flex-start"
            }
        },
    ];
}

export function InvestorRelations(props: InvestorRelationsProps) {
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth > 480 && window.innerWidth <= 768;

    const columnDefs = useMemo<ColDef[]>(() => {
        const baseDefs = getColumnDef();
        return baseDefs.map((col) => {
            if (isMobile) {
                return { ...col, width: col.width ? col.width * 0.7 : undefined };
            } else if (isTablet) {
                return { ...col, width: col.width ? col.width * 0.85 : undefined };
            }
            return col;
        });
    }, [isMobile, isTablet]);

    const [investorInquiries, setInvestorInquiries] = useState<InquiryRequest[]>();

    function loadInquiries() {
        const loadDataAsync = async () => {
            const inquiries = await getInquiries();
            setInvestorInquiries(inquiries);
        }

        loadDataAsync();
    }

    useEffect(
        () => loadInquiries(),
        []);

    return (
        <div className={styles['investor-relations']}>
            <div className={styles['inquiries-grid']}>
                <DataGrid
                    isSummaryGrid={true}
                    rowData={investorInquiries}
                    columnDefs={columnDefs}
                    rowSelection={'single'}
                />
            </div>
        </div>
    );
}