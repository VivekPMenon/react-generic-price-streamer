'use client'

import styles from './investor-relations.module.scss';
import React, {useCallback, memo} from 'react';
import {DataGrid} from "@/components/data-grid";
import {RequestFormPopup} from "@/components/investor-relations/request-form-popup";
import {useInvestorRelationsStore} from "@/services/investor-relations-data/investor-relations-store";
import {tryParseAndFormatDateOnly} from "@/lib/utility-functions/date-operations";
import {ColDef, FirstDataRenderedEvent, GetRowIdParams, GridSizeChangedEvent} from "ag-grid-community";
import {executeAsync} from "@/lib/utility-functions/async";
import { toast } from 'react-toastify';
import i18n from '../../i18n';
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

function handleFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.resetRowHeights();
    params.api.sizeColumnsToFit();
}

function handleGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.resetRowHeights();
    executeAsync(() => params.api.sizeColumnsToFit(), 10);
}

function DeleteButton(props: any) {
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleClick = () => {
        setIsDeleting(true);

        props.onDelete(props.data.id)
            .then((result: boolean) => {
                if (result) {
                    props.api.applyTransaction({remove: [props.data]});
                    return;
                }
                setIsDeleting(false);
            })
            .catch(() => {
                setIsDeleting(false);
            });
    }

    return (
        <i className={`fa-solid ${isDeleting ? 'fa-spinner' : 'fa fa-trash' }`}
           style={{cursor: (isDeleting ? 'none' : 'pointer')}}
           onClick={handleClick}
        ></i>);
}

function InvestorRelations() {
    const { inquiries, isLoading, changeStatus, deleteInquiry, updateStatusFromCompleted } = useInvestorRelationsStore();
    const getColumnDefs= useCallback((): ColDef[] => {
        return [
            {
                maxWidth: 40,
                editable: false,
                sortable: false,
                filter: false,
                pinned: 'left',
                lockPinned: true,
                suppressNavigable: true,
                cellRenderer: (props: any) => (<DeleteButton {...props} onDelete={deleteInquiry} />)
            },
            {
                field: 'date',
                headerName: i18n.t('Date'),
                minWidth: 125,
                autoHeight: true,
                wrapText: true,
                cellClass: 'date-cell',
                valueFormatter: (params: any) => {
                    return tryParseAndFormatDateOnly(params.value)
                }
            },
            {
                field: 'owner_name',
                headerName: i18n.t('From'),
                minWidth: 100,
            },
            {
                field: 'assignee_name',
                headerName: i18n.t('To'),
                minWidth: 100,
            },
            {
                field: 'subject',
                headerName: i18n.t('Subject'),
                width: 250,
            },
            {
                field: 'inquiry',
                headerName: i18n.t('Inquiry/Request'),
                width: 500,
                maxWidth: 500,
                wrapText: true,
                autoHeight: true,
            },
            {
                field: 'completed',
                headerName: i18n.t('Status'),
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
                headerName: i18n.t('Flag'),
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
                headerName: i18n.t('Due'),
                minWidth: 125,
                cellClass: 'date-cell',
                autoHeight: true,
                wrapText: true,
                valueFormatter: (params: any) => {
                    return tryParseAndFormatDateOnly(params.value)
                }
            },
            {
                field: 'date_edited',
                headerName: i18n.t('Date edited'),
                minWidth: 125,
                cellClass: 'date-cell',
                autoHeight: true,
                wrapText: true,
                valueFormatter: (params: any) => {
                    return tryParseAndFormatDateOnly(params.value)
                }
            },
        ];
    }, [changeStatus]);

    const columnDefs = getColumnDefs();
    return (
        <div className={styles['investor-relations']}>
            <div className={styles['header']}>
                <span>{i18n.t('Investor_Relations_Inquiries')}</span>
                <RequestFormPopup onSubmitted={(msg) => toast.success(msg)}>
                    <i className='fa-regular fa-3x fa-file cursor-pointer' />
                </RequestFormPopup>
            </div>
            <div className={styles['inquiries-grid']}>
                <DataGrid
                    isSummaryGrid={true}
                    rowData={inquiries}
                    columnDefs={columnDefs}
                    loading={isLoading}
                    gridOptions={{
                        getRowId: (params: GetRowIdParams) => params.data.id,
                    }}
                    onFirstDataRendered={handleFirstDataRendered}
                    onGridSizeChanged={handleGridSizeChanged}
                />
            </div>
        </div>
    );
}

export default memo(InvestorRelations)