import { useDeviceType } from '@/lib/hooks'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { DataGrid } from '../data-grid'
import { ColDef } from 'ag-grid-community'
import styles from './pms-live.module.scss'
import ColumnManagement from './column-management'
import { TaDialog } from '../shared/ta-dialog/ta-dialog'
import { Button } from '@radix-ui/themes'
import { pmsDataService } from '@/services/pms-live'
import { IColumnItem, IPmsGridColsList } from './model'

interface Props {}

const MemoizedDataGrid = React.memo(DataGrid)

export const PmsLiveNew = ({}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false)

  // Define all available columns
  const [columnList, setColumnList] = useState<IColumnItem[]>([])

  // Currently displayed columns
  const [visibleColumns, setVisibleColumns] = useState<IColumnItem[]>([])
  const deviceType = useDeviceType()
  const isMobile = deviceType !== 'desktop'

  useEffect(() => {
    let isMounted = true
    const fetchColumnsList = async () => {
      setIsLoading(true)
      try {
        const response = await pmsDataService.getColumList()
        const data = response.data as IPmsGridColsList[]
        const allColumnsList =
          data?.map(col => ({
            ...col,
            field: col.field,
            headerName: col.column_name,
            headerClass: `${styles['table-header']} ag-left-aligned-header`,
            aggFunc: 'sum',
            suppressMovable: true
          })) || []

        const selectedColumns =
          allColumnsList.filter(col => col.is_default) || []
        if (isMounted) {
          setVisibleColumns(selectedColumns)
          setColumnList(allColumnsList)
        }
      } catch (error) {
        console.error('Error fetching columns:', error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchColumnsList()
    return () => {
      isMounted = false
    }
  }, [])

  const gridOptions = useMemo(() => ({}), [])

  const dataset = useMemo(
    () => [
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
      },
      {
        id: 4,
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
    ],
    []
  )

  const handleColumnsChange = useCallback((selectedColumns: IColumnItem[]) => {
    setVisibleColumns(selectedColumns)
  }, [])

  const openColumnManagement = useCallback(() => {
    setIsOpenForm(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsOpenForm(false)
  }, [])

  const handleUpdateColumns = useCallback(
    async (columns: IColumnItem[]) => {
      try {
        const updatedItems = onGetUpdatedItems(columnList, columns)

        // Only make API call if there are actually updated items
        if (updatedItems.length > 0) {
          const response = await pmsDataService.updateColumnOrder(updatedItems)
          console.log('Column order updated successfully:', response)
        }

        // Update the state with new columns
        setColumnList(columns)

        // Also update the displayed columns to reflect changes
        const selectedColumns = columns.filter(col => col.is_selected) || []
        setVisibleColumns(selectedColumns)
      } catch (error) {
        console.error('Error updating columns:', error)
        // Optionally, you might want to show a user-friendly error message here
      }
    },
    [columnList]
  )

  const onGetUpdatedItems = (
    oldItems: IColumnItem[],
    newItems: IColumnItem[]
  ): IColumnItem[] => {
    if (oldItems.length <= 0 || newItems.length <= 0) {
      return []
    }

    try {
      const updatedItems: IColumnItem[] = []

      oldItems.forEach(data => {
        const cItem = newItems.find(nItem => nItem.id === data.id)
        if (!cItem) {
          return
        }

        if (
          cItem.order_id !== data.order_id ||
          cItem.is_selected !== data.is_selected
        ) {
          updatedItems.push(cItem)
        }
      })

      return updatedItems
    } catch (error) {
      console.error('Error getting updated items:', error)
      return []
    }
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
        domLayout='normal'
        height={isMobile ? 500 : '95%'}
        isSummaryGrid={false}
        suppressScrollOnNewData
        suppressStatusBar
        suppressFloatingFilter={false}
        columnDefs={visibleColumns}
        rowData={dataset}
        gridOptions={gridOptions}
        loading={isLoading}
      />

      <TaDialog
        title='Manage Columns'
        isOpen={isOpenForm}
        onClose={handleCloseForm}
      >
        <ColumnManagement
          availableColumns={columnList}
          currentColumns={visibleColumns}
          onColumnsChange={handleColumnsChange}
          onClose={handleCloseForm}
          onBulkUpdateColumns={handleUpdateColumns}
        />
      </TaDialog>
    </div>
  )
}
