import { useDeviceType } from '@/lib/hooks'
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { DataGrid } from '../data-grid'
import {
  ColDef,
  GridOptions,
  FilterChangedEvent,
  SortChangedEvent
} from 'ag-grid-community'
import styles from './pms-live.module.scss'
import ColumnManagement from './column-management'
import { TaDialog } from '../shared/ta-dialog/ta-dialog'
import { Button } from '@radix-ui/themes'
import { pmsDataService } from '@/services/pms-live'
import { IColumnItem, IPmsGridColsList } from './model'
import CustomPagination from '../shared/ta-pagination/ta-pagination'

interface Props {}
interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

const MemoizedDataGrid = React.memo(DataGrid)

const createColumnTransformer = () => {
  return (columns: IPmsGridColsList[]): IColumnItem[] => {
    return columns.map(col => {
      const baseColumn = {
        ...col,
        field: col.field,
        headerName: col.column_name || col.label,
        headerClass: `${styles['table-header']} ag-left-aligned-header`,
        aggFunc: 'sum',
        suppressMovable: false,
        pinned: col.is_frozen ? ('left' as const) : null,
        cellClass: col.is_frozen ? 'frozen-column' : '',
        minWidth: col.is_frozen ? 120 : undefined,
        headerTooltip: col.is_frozen
          ? `${col.column_name || col.label} (Pinned)`
          : col.column_name || col.label,
        menuTabs: ['generalMenuTab', 'filterMenuTab', 'columnsMenuTab']
      }

      // Customize filter params based on column
      const filterParams = {
        filterOptions: ['contains', 'equals'],
        suppressAndOrCondition: true,
        defaultOption: 'contains'
      }

      return {
        ...baseColumn,
        filterParams
      } as IColumnItem
    })
  }
}

// Constants outside component to prevent recreation
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
const GRID_HEIGHT = 500
const INITIAL_PAGE = 1
const INITIAL_PAGE_SIZE = 10

export const PmsLiveNew = ({}: Props) => {
  // State management
  const [pageSize, setPageSize] = useState<number>(INITIAL_PAGE_SIZE)
  const [currentPage, setCurrentPage] = useState<number>(INITIAL_PAGE)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false)
  const [rawData, setRawData] = useState([])
  const [columnList, setColumnList] = useState<IColumnItem[]>([])
  const [visibleColumns, setVisibleColumns] = useState<IColumnItem[]>([])

  // New state for filters and sorts
  const [currentFilters, setCurrentFilters] = useState<any>({})
  const [currentSorts, setCurrentSorts] = useState<SortOption[]>([])

  // Refs for stable references
  const transformColumnsRef = useRef(createColumnTransformer())
  const fetchRequestRef = useRef<AbortController | null>(null)
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const sortTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const deviceType = useDeviceType()
  const isMobile = deviceType !== 'desktop'

  // Simple function to convert AG Grid filters to URL format
  const convertFiltersToUrlFormat = useCallback((filterModel: any) => {
    const urlFilters: { [key: string]: string } = {}

    Object.entries(filterModel || {}).forEach(
      ([field, filter]: [string, any]) => {
        if (!filter) return

        let filterValue = ''
        
        // Handle different filter types
        if (filter.filter !== undefined) {
          // Text/Number filters
          const operator = filter.type === 'contains' ? 'like' : 'eq'
          filterValue = `${operator}:${filter.filter}`
        } else if (filter.values && Array.isArray(filter.values)) {
          // Set filter (multi-select)
          filterValue = `in:${filter.values.join(',')}`
        } else if (filter.dateFrom) {
          // Date filter
          filterValue = `eq:${filter.dateFrom}`
        }

        if (filterValue) {
          urlFilters[`filter_${field}`] = filterValue
        }
      }
    )

    return urlFilters
  }, [])

  // Simple function to convert AG Grid sorts to URL format
  const convertSortsToUrlFormat = useCallback((sortOptions: SortOption[]) => {
    if (!sortOptions || sortOptions.length === 0) return {}

    // For simplicity, take only the first sort
    const firstSort = sortOptions[0]
    return {
      sort: `${firstSort.field}:${firstSort.direction}`
    }
  }, [])

  // Memoized grid options - stable reference
  const gridOptions = useMemo<GridOptions<any>>(
    () => ({
      suppressColumnMoveAnimation: false,
      suppressMovableColumns: false,
      allowDragFromColumnsToolPanel: true,
      getRowStyle: () => ({ borderRight: '1px solid #e0e0e0' }),
      enableRangeSelection: true,
      columnMenu: 'new' as 'new' | 'legacy',
      // Optimization: reduce DOM updates
      suppressRowTransform: true,
      animateRows: false,
      suppressAggFuncInHeader: true,
      suppressPinnedRight: true
    }),
    []
  )

  // Memoized processed columns with optimized sorting
  const processedVisibleColumns = useMemo(() => {
    if (!visibleColumns.length) return []

    // Cache the sort function result
    const frozenColumns: IColumnItem[] = []
    const regularColumns: IColumnItem[] = []

    visibleColumns.forEach(col => {
      const processedCol = {
        ...col,
        pinned: col.is_frozen ? ('left' as const) : null,
        cellClass: col.is_frozen ? 'frozen-column' : '',
        minWidth: col.is_frozen ? 120 : undefined,
        headerTooltip: col.is_frozen
          ? `${col.column_name || col.label} (Pinned)`
          : col.column_name || col.label
      } as IColumnItem

      if (col.is_frozen) {
        frozenColumns.push(processedCol)
      } else {
        regularColumns.push(processedCol)
      }
    })

    // Sort each group by order_id
    frozenColumns.sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0))
    regularColumns.sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0))

    return [...frozenColumns, ...regularColumns]
  }, [visibleColumns])

  // Enhanced data fetching with filters and sorts
  const fetchPmsLiveData = useCallback(
    async (
      page: number,
      size: number,
      manageLoading = true,
      filters = {},
      sorts: SortOption[] = []
    ) => {
      // Cancel previous request if still pending
      if (fetchRequestRef.current) {
        fetchRequestRef.current.abort()
      }

      fetchRequestRef.current = new AbortController()

      if (manageLoading) {
        setIsLoading(true)
      }
      try {
        // Convert filters and sorts to URL format
        const urlFilters = convertFiltersToUrlFormat(filters)
        const urlSorts = convertSortsToUrlFormat(sorts)

        const response = await pmsDataService.getPMSLiveData(page, size, {
          ...urlFilters,
          ...urlSorts
        })

        // Batch state updates
        const pagination = response.pagination || {
          currentPage: 1,
          totalPages: 1,
          total_items: response.data?.length || 0,
          pageSize: size
        }

        // Single state update with all pagination data
        setRawData(response.data || [])
        setCurrentPage(pagination.page)
        setTotalPages(pagination.total_pages)
        setTotalItems(pagination.total_items)
        setPageSize(pagination.page_size)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        if (manageLoading) {
          setIsLoading(false)
        }
        fetchRequestRef.current = null
      }
    },
    [convertFiltersToUrlFormat, convertSortsToUrlFormat]
  )

  const handleFilterChanged = useCallback(
    (event: FilterChangedEvent) => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current)
      }
   
        const filterModel = event.api.getFilterModel()
        setCurrentFilters(filterModel)
        filterTimeoutRef.current = setTimeout(() => {


          // Deep compare with current filters to avoid unnecessary calls
          if (JSON.stringify(filterModel) !== JSON.stringify(currentFilters)) {

            fetchPmsLiveData(1, pageSize, true, filterModel, currentSorts)
          }
        }, 500) // 500ms debounce
    },
    [fetchPmsLiveData, pageSize, currentSorts, currentFilters]
  )

  // Sort change handler with debouncing
  const handleSortChanged = useCallback(
    (event: SortChangedEvent) => {
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current)
      }

      sortTimeoutRef.current = setTimeout(() => {
        const columns = event.columns
        if (!columns) {
          return
        }
        const sort: SortOption[] = columns
          .filter((col: any) => col.sort)
          .map((x: any) => {
            return { field: x?.colId, direction: x?.sort }
          })

        setCurrentSorts(sort)

        // Fetch data with new sort
        fetchPmsLiveData(currentPage, pageSize, true, currentFilters, sort)
      }, 300) // 300ms debounce for sort
    },
    [fetchPmsLiveData, currentPage, pageSize, currentFilters]
  )

  // Optimized column list fetcher
  const fetchDisplayColumnsList = useCallback(async (manageLoading = true) => {
    if (manageLoading) {
      setIsLoading(true)
    }
    try {
      const response = await pmsDataService.getDisplayColumList()
      const data = response.data as IPmsGridColsList[]
      const columnsList = transformColumnsRef.current(data)
      setVisibleColumns(columnsList)
    } catch (error) {
      console.error('Error fetching columns:', error)
    } finally {
      if (manageLoading) {
        setIsLoading(false)
      }
    }
  }, [])

  // Optimized column pinning handler with debouncing
  const handleColumnPinned = useCallback(
    async (event: any) => {
      if (!event.column || event.pinned === undefined) return

      const columnId = event.column.getColId()
      const isPinned = event.pinned === 'left'
      const columnToUpdate = visibleColumns.find(
        col => col.field === columnId || col.colId === columnId
      )

      if (!columnToUpdate?.id) return

      try {
        const updateRequest = {
          freeze: [
            {
              id: columnToUpdate.id,
              status: isPinned
            }
          ]
        }

        await pmsDataService.updateColumns(updateRequest)
      } catch (error) {
        console.error('Error updating column pin status:', error)
        // Revert UI change on error
        event.api.setColumnPinned(
          columnId,
          columnToUpdate?.is_frozen ? 'left' : null
        )
      }
    },
    [visibleColumns]
  )

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
  }

  // Optimized column move handler
  const handleColumnMoved = useCallback(
    debounce(async (event: any) => {
      let columnList: IPmsGridColsList[] = []
      // Only proceed if this is the final drop event
      if (event.source !== 'uiColumnMoved' || !event.finished) return

      try {
        const columnApi = event.api
        if (!columnApi) {
          console.error('Column API not available')
          return
        }

        const allDisplayedColumns = columnApi.getAllDisplayedColumns()

        const orderedColumnIds = allDisplayedColumns
          .map((col: any) => {
            const columnId = col.getColId()
            const columnData = visibleColumns.find(
              visCol => visCol.field === columnId || visCol.colId === columnId
            )
            return columnData?.id
          })
          .filter(Boolean)

        const updateRequest = {
          updated_columns: orderedColumnIds
        }

        setIsLoading(true)
        const res = await pmsDataService.updateColumns(updateRequest)
        columnList = res.data as IPmsGridColsList[]
      } catch (error) {
        console.error('Error updating column order:', error)
      } finally {
        setIsLoading(false)
        if (columnList.length > 0) {
          const list = transformColumnsRef.current(columnList)
          setVisibleColumns(list)
        }
      }
    }, 300),
    [visibleColumns]
  )

  const openColumnManagement = useCallback(() => setIsOpenForm(true), [])
  const handleCloseForm = useCallback(() => setIsOpenForm(false), [])

  // Fixed handleUpdateColumns with proper error handling and state management
  const handleUpdateColumns = useCallback(
    async (columns: IColumnItem[]) => {
      setColumnList(columns)
      const updatedItems = columns
        .filter(items => items.is_selected)
        .map(x => x.id)

      if (updatedItems.length === 0) {
        console.warn('No columns selected for update')
        return
      }

      try {
        setIsLoading(true)

        // First update the columns
        const updateResponse = await pmsDataService.updateColumns({
          updated_columns: updatedItems
        })

        // Check if the update was successful
        if (updateResponse && updateResponse.success !== false) {
          // Wait for both API calls to complete
          await Promise.allSettled([
            fetchDisplayColumnsList(false),
            fetchPmsLiveData(
              currentPage,
              pageSize,
              false,
              currentFilters,
              currentSorts
            )
          ])

          // Close the dialog after successful update
          handleCloseForm()
        } else {
          throw new Error('Column update failed')
        }
      } catch (error) {
        console.error('Error updating columns:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [
      currentPage,
      pageSize,
      currentFilters,
      currentSorts,
      fetchDisplayColumnsList,
      fetchPmsLiveData,
      handleCloseForm
    ]
  )

  // Enhanced pagination handlers to include filters and sorts
  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== currentPage) {
        fetchPmsLiveData(page, pageSize, true, currentFilters, currentSorts)
      }
    },
    [currentPage, pageSize, currentFilters, currentSorts, fetchPmsLiveData]
  )

  const handlePageSizeChange = useCallback(
    (size: number) => {
      if (size !== pageSize) {
        fetchPmsLiveData(INITIAL_PAGE, size, true, currentFilters, currentSorts)
      }
    },
    [pageSize, currentFilters, currentSorts, fetchPmsLiveData]
  )

  // Effects with cleanup
  useEffect(() => {
    let isMounted = true

    const fetchInitialData = async () => {
      if (isMounted) {
        await Promise.all([
          fetchDisplayColumnsList(true),
          fetchPmsLiveData(INITIAL_PAGE, INITIAL_PAGE_SIZE, false, {}, [])
        ])
      }
    }

    fetchInitialData()
    return () => {
      isMounted = false
      if (fetchRequestRef.current) {
        fetchRequestRef.current.abort()
      }
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current)
      }
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current)
      }
    }
  }, [fetchDisplayColumnsList, fetchPmsLiveData])

  useEffect(() => {
    let isMounted = true

    const fetchAllColumnsList = async () => {
      setIsLoading(true)
      try {
        const response = await pmsDataService.getAllColumList()
        if (isMounted) {
          const columnsWithSelection = (
            response.data as IPmsGridColsList[]
          ).map(col => ({
            ...col,
            is_selected: col.is_selected
          }))
          setColumnList(columnsWithSelection as IColumnItem[])
        }
      } catch (error) {
        console.error('Error fetching all columns:', error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchAllColumnsList()
    return () => {
      isMounted = false
    }
  }, [])

  // Enhanced grid configuration with filter and sort handlers
  const gridConfig = useMemo(
    () => ({
      ...gridOptions,
      onColumnPinned: handleColumnPinned,
      suppressColumnMoveAnimation: true,
      suppressDragLeaveHidesColumns: true,
      onColumnMoved: handleColumnMoved,
      // Add filter and sort event handlers
      onFilterChanged: handleFilterChanged,
      onSortChanged: handleSortChanged,
      alwaysShowHorizontalScroll: true,
      alwaysShowVerticalScroll: true,
      initialState: {
      filter: {
        filterModel: currentFilters
      }
    }
    }),
    [
      gridOptions,
      handleColumnPinned,
      handleColumnMoved,
      handleFilterChanged,
      handleSortChanged
    ]
  )

  return (
    <div className={`${styles['hurricane-pms']} h-full scrollable-div w-full`}>
      <div className='mb-4 flex justify-start'>
        <Button
          onClick={openColumnManagement}
          type='submit'
          size={'2'}
          color='teal'
          variant='solid'
        >
          Choose Columns
        </Button>
      </div>

      <div style={{ height: `${GRID_HEIGHT}px`, width: '100%' }}>
        <MemoizedDataGrid
          className='hurrican-grid'
          domLayout='normal'
          height={isMobile ? GRID_HEIGHT : '95%'}
          isSummaryGrid={false}
          suppressScrollOnNewData
          suppressStatusBar
          suppressFloatingFilter={false}
          columnDefs={processedVisibleColumns}
          rowData={rawData}
          gridOptions={gridConfig}
          loading={isLoading}
        />

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          totalItems={totalItems}
          loading={isLoading}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <TaDialog
        title='Manage Columns'
        isOpen={isOpenForm}
        onClose={handleCloseForm}
      >
        <ColumnManagement
          availableColumns={columnList}
          currentColumns={visibleColumns}
          onClose={handleCloseForm}
          onBulkUpdateColumns={handleUpdateColumns}
        />
      </TaDialog>
    </div>
  )
}
