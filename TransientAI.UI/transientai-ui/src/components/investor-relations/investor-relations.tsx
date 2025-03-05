'use client'

import styles from './investor-relations.module.scss';
import React, {CSSProperties, useEffect, useMemo, useState} from 'react';
import {DataGrid} from "@/components/data-grid";
import {getInquiries, InquiryRequest} from "@/services/investor-relations-data";
import {ColDef} from "ag-grid-community";
import {RequestFormPopup} from "@/components/investor-relations/request-form-popup";
import {investorRelationsService} from "@/services/investor-relations-data";

export interface InvestorRelationsProps {
}

function getFlagStyle(flag: string|undefined|null) {
    const style: CSSProperties = { };
    switch(flag) {
        case 'urgent': {
            style.color = 'red';
            break;
        }
        case 'important': {
            style.color = 'red';
            break;
        }
        case 'regular': {
            style.color = 'green';
            break;
        }
        default: {
            style.display = 'none';
            break;
        }
    }
    return style;
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
                "alignItems": "flex-start"
            }
        },
        {
            field: 'assignee',
            headerName: 'From',
            width: 100,
            cellStyle: {
                "display": "flex",
                "alignItems": "flex-start"
            }
        },
        {
            field: 'subject',
            headerName: 'Subject',
            width: 250,
            cellStyle: {
                "display": "flex",
                "alignItems": "flex-start"
            }
        },
        {
            field: 'inquiry',
            headerName: 'Inquiry/Request',
            width: 500,
            maxWidth: 500,
            wrapText: true,
            autoHeight: true,
            cellStyle: {
                "display": "flex",
                "alignItems": "flex-start"
            }
        },
        {
            field: 'completed',
            headerName: 'Status',
            width: 150,
            autoHeight: true,
            editable: true,
            cellRenderer: 'agCheckboxCellRenderer',
            cellEditor: 'agCheckboxCellEditor',
            onCellValueChanged: (params) => {
                params.data.status = params.data.completed
                    ? 'completed'
                    : 'open';

                investorRelationsService
                    .changeStatus(
                        params.data.assignee,
                        params.data.id,
                        params.data.status
                    );
            },
            cellStyle: {
                "justifyContent": "center",
                "alignItems": "flex-start"
            },
        },
        {
            field: 'flag',
            headerName: 'Flag',
            width: 100,
            cellStyle: {
                "justifyContent": "center",
                "alignItems": "flex-start"
            },
            cellRenderer: (params: any) => {
                const style = getFlagStyle(params.data.flag?.toLowerCase());
                return (
                    <i className='fa-regular fa-2x fa-flag' style={style}></i>
                );
            },
        },
        {
            field: 'due_date',
            headerName: 'Due',
            width: 100,
            cellClass: 'date-cell',
            cellStyle: {
                "display": "flex",
                "alignItems": "flex-start"
            }
        },
        {
            field: 'date_edited',
            headerName: 'Date edited',
            width: 100,
            cellClass: 'date-cell',
            cellStyle: {
                "display": "flex",
                "alignItems": "flex-start"
            }
        },
    ];
}

export function InvestorRelations(props: InvestorRelationsProps) {
    const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);
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
            <div className={styles['header']}>
                <span>Investor Relations Inquiries</span>
                <RequestFormPopup>
                    <i className='fa-regular fa-3x fa-file cursor-pointer'/>
                </RequestFormPopup>
            </div>
            <div className={styles['inquiries-grid']}>
                <DataGrid
                    isSummaryGrid={true}
                    rowData={investorInquiries}
                    columnDefs={columnDefs}
                />
            </div>
        </div>
    );
}