import { useDeviceType } from '@/lib/hooks'
import React, { useState } from 'react'
import { DataGrid } from '../data-grid'
import { ColDef } from 'ag-grid-community'
import styles from './pms-live.module.scss'
import ColumnManagement from './column-management'
import { TaDialog } from '../shared/ta-dialog/ta-dialog'
import { Button } from '@radix-ui/themes'

interface Props {}

export const PmsLiveNew = ({}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false)

  // Define all available columns
  const [allAvailableColumns] = useState<ColDef[]>([
    {
      field: 'manager_name',
      headerName: 'Manager',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'company',
      headerName: 'Legal Entity',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'strategy',
      headerName: 'Strategy',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'security_type',
      headerName: 'Security Type',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'clearing_broker',
      headerName: 'Clearing Broker',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'sid',
      headerName: 'SID',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'ticker',
      headerName: 'Ticker',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'security_description',
      headerName: 'Security Description',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      headerClass: `${styles['table-header']} ag-right-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'end_price_base_usd',
      headerName: 'End Price (USD)',
      headerClass: `${styles['table-header']} ag-right-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'end_price_[n]',
      headerName: 'End Price (Local)',
      headerClass: `${styles['table-header']} ag-right-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'currency_ticker',
      headerName: 'Currency',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'daily_p&l',
      headerName: 'Daily P&L',
      headerClass: `${styles['table-header']} ag-right-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'notional',
      headerName: 'Notional',
      headerClass: `${styles['table-header']} ag-right-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'market_value',
      headerName: 'Market Value',
      headerClass: `${styles['table-header']} ag-right-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'country_name',
      headerName: 'Country',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    }
  ])

  // Currently displayed columns (initially showing first 4)
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: 'manager_name',
      headerName: 'Manager',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum',
      suppressMovable: true
    },
    {
      field: 'company',
      headerName: 'Legal Entity',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'strategy',
      headerName: 'Strategy',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    },
    {
      field: 'security_type',
      headerName: 'Security Type',
      headerClass: `${styles['table-header']} ag-left-aligned-header`,
      aggFunc: 'sum'
    }
  ])

  const [dataset, setDataset] = useState<any[]>([
    {
      id: 1,
      manager_name: 'ANDREA',
      company: 'Hurricane',
      strategy: 'ALPHA',
      clearing_broker: 'GSCO',
      security_type: 'Equity',
      sid: '102009674',
      ticker: 'ORNBV',
      security_description: 'ORION OYJ-CLASS B',
      quantity: 804.0,
      end_price_base_usd: 51.307,
      'end_price_[n]': 104.63,
      currency_ticker: 'EUR',
      'daily_p&l': -18548.21,
      notional: 1795.18822023047,
      contract_size: '',
      market_value: 84122.52,
      iso_a2: 'de',
      country_name: 'Germany'
    },
    {
      id: 2,
      manager_name: 'ANDREA',
      company: 'Hurricane',
      strategy: 'ALPHA',
      clearing_broker: 'GSCO',
      security_type: 'Equity',
      sid: '101676445',
      ticker: 'RBREW',
      security_description: 'ROYAL UNIBREW',
      quantity: 585.0,
      end_price_base_usd: 77.728,
      'end_price_[n]': 112.98,
      currency_ticker: 'DKK',
      'daily_p&l': -17799.62,
      notional: 124.704339622642,
      contract_size: '',
      market_value: 66093.3,
      iso_a2: 'dk',
      country_name: 'Denmark'
    },
    {
      id: 3,
      manager_name: 'ANDREA',
      company: 'Hurricane',
      strategy: 'ALPHA',
      clearing_broker: 'GSCO',
      security_type: 'Equity',
      sid: '102829224',
      ticker: 'UMG',
      security_description: 'UNIVERSAL MUSIC GROUP NV',
      quantity: 541.0,
      end_price_base_usd: 25.127,
      'end_price_[n]': 92.32,
      currency_ticker: 'EUR',
      'daily_p&l': -17186.07,
      notional: 2176.25795206972,
      contract_size: '',
      market_value: 49945.12,
      iso_a2: 'de',
      country_name: 'Germany'
    }
  ])

  const deviceType = useDeviceType()
  const isMobile = deviceType !== 'desktop'
  const MemoizedDataGrid = React.memo(DataGrid)

  const handleColumnsChange = (selectedColumns: ColDef[]) => {
    setColumnDefs(selectedColumns)
  }

  const openColumnManagement = () => {
    setIsOpenForm(true)
  }

  return (
    <div className={`${styles['hurricane-pms']} scrollable-div w-full`}>
      <div className='mb-4 flex justify-start'>
        <Button
          onClick={openColumnManagement}
          type='submit'
          size={'3'}
          color='teal'
          variant='solid'
        >
          Choose Columns
        </Button>
      </div>

      <MemoizedDataGrid
        className='hurrican-grid'
        domLayout={'normal'}
        height={isMobile ? 500 : '95%'}
        isSummaryGrid={false}
        suppressScrollOnNewData={true}
        suppressStatusBar={true}
        suppressFloatingFilter={false}
        columnDefs={columnDefs}
        rowData={dataset}
        gridOptions={{}}
        loading={isLoading}
      />

      <TaDialog
        title='Manage Columns'
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
      >
        <ColumnManagement
          availableColumns={allAvailableColumns}
          currentColumns={columnDefs}
          onColumnsChange={handleColumnsChange}
          onClose={() => setIsOpenForm(false)}
        />
      </TaDialog>
    </div>
  )
}
