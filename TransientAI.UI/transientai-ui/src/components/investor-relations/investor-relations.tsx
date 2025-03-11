'use client'

import styles from './investor-relations.module.scss';
import React, {useCallback, useRef, useState} from 'react';
import {DataGrid} from "@/components/data-grid";
import {RequestFormPopup} from "@/components/investor-relations/request-form-popup";
import {useInvestorRelationsStore} from "@/services/investor-relations-data/investor-relations-store";
import {tryParseAndFormat} from "@/lib/utility-functions/date-operations";
import {Toast} from '@/components/toast';

function getFlagStyle(flag: string|undefined|null) {
    const style: any = { display: "flex" };
    switch(flag) {
        case 'urgent': {
            style.color = 'red';
            break;
        }
        case 'important': {
            style.color = 'orange';
            break;
        }
        case 'regtask': {
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

export function InvestorRelations() {
    const { inquiries, isLoading, changeStatus, updateStatusFromCompleted } = useInvestorRelationsStore();
    const getColumnDefs = useCallback(() => {
        return [
            {
                field: 'date',
                headerName: 'Date',
                width: 100,
                cellClass: 'date-cell',
            },
            {
                field: 'assignee_name',
                headerName: 'From',
                width: 100,
            },
            {
                field: 'subject',
                headerName: 'Subject',
                width: 250,
            },
            {
                field: 'inquiry',
                headerName: 'Inquiry/Request',
                width: 500,
                maxWidth: 500,
                wrapText: true,
                autoHeight: true,
            },
            {
                field: 'completed',
                headerName: 'Status',
                width: 150,
                autoHeight: true,
                editable: true,
                cellRenderer: 'agCheckboxCellRenderer',
                cellEditor: 'agCheckboxCellEditor',
                onCellValueChanged: (params: any) => {
                    updateStatusFromCompleted(params.data);
                    changeStatus(
                            params.data.id,
                            params.data.status
                        );
                },
            },
            {
                field: 'flag',
                headerName: 'Flag',
                width: 100,
                cellRenderer: (params: any) => {
                    const style = getFlagStyle(params.data.flag?.toLowerCase());
                    return (
                        <i className='fa-regular fa-2x fa-solid fa-flag' style={style}></i>
                    );
                },
            },
            {
                field: 'due_date',
                headerName: 'Due',
                width: 100,
                cellClass: 'date-cell',
                autoHeight: true,
                wrapText: true,
                valueFormatter: (params: any) => {
                    return tryParseAndFormat(params.value)
                }
            },
            {
                field: 'date_edited',
                headerName: 'Date edited',
                width: 100,
                cellClass: 'date-cell',
                autoHeight: true,
                wrapText: true,
                valueFormatter: (params: any) => {
                    return tryParseAndFormat(params.value)
                }
            },
        ];
    }, [changeStatus]);

    const columnDefs = getColumnDefs();
    const [open, setOpen] = useState(false);

    return (
        <div className={styles['investor-relations']}>
            <div className={styles['header']}>
                <span>Investor Relations Inquiries</span>
                <RequestFormPopup onSubmitted={() => setOpen(true)}>
                    <i className='fa-regular fa-3x fa-file cursor-pointer'/>
                </RequestFormPopup>
            </div>
            <div className={styles['inquiries-grid']}>
                <DataGrid
                    isSummaryGrid={true}
                    rowData={inquiries}
                    columnDefs={columnDefs}
                    loading={isLoading}
                />
            </div>
            {/*<Toast*/}
            {/*    altText='Saved successfully.'*/}
            {/*    type='foreground'*/}
            {/*    content='Saved successfully.'*/}
            {/*    defaultOpen={false}*/}
            {/*    open={open}*/}
            {/*    onOpenChange={setOpen}*/}
            {/*/>*/}
        </div>
    );
}