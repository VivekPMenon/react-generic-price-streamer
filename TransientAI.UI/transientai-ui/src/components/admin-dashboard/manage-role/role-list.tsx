'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { DataGrid } from '../../data-grid'
import { Button } from '@radix-ui/themes/components/button'
import Toggle from 'react-toggle'
import SearchComponent, { SearchItem } from '../../shared/ta-search/ta-search'
import ActionCell from '../action-cell'
import { TaDialog } from '../../shared/ta-dialog/ta-dialog'
import { RoleForm } from './role-form'
import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service'
import CustomPagination from '@/components/shared/ta-pagination/ta-pagination'
import { toast } from 'react-toastify'
import {
  SearchTableName
} from '@/services/admin-dashboard/model'
interface Role {
  role_id: number
  role_name: string
  created_on: string
}

const RoleList = () => {
  const pageSizeOptions = [10, 25, 50, 100]
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [roles, setRoles] = useState<Role[]>([])
  const gridRef = useRef<GridApi | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role>()

  useEffect(() => {
    fetchRoles(currentPage, pageSize)
  }, [])

  const fetchRoles = async (
    page: number,
    size: number,
    searchRoleId?: number
  ) => {
    setLoading(true)
    try {
      // Call your API service with pagination parameters
      const response = await adminDashboardDataService.getRolesList(
        page,
        size,
        false,
        searchRoleId
      )

      // Update users and pagination data from the response
      setRoles(response.data || [])

      // Update pagination state from API response
      const pagination = response.pagination || {
        page: 1,
        total_pages: 1,
        total_items: response.data?.length || 0,
        page_size: size
      }

      setCurrentPage(pagination.page)
      setTotalPages(pagination.total_pages)
      setTotalItems(pagination.total_items)
      setPageSize(pagination.page_size)
    } catch (error) {
      console.error('Error fetching Roles:', error)
      // Handle error state
    } finally {
      setLoading(false)
    }
  }

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api
  }

  // Handle page change from custom pagination
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      fetchRoles(page, pageSize)
    }
  }

  // Handle page size change from custom pagination
  const handlePageSizeChange = (size: number) => {
    if (size !== pageSize) {
      fetchRoles(1, size) // Reset to first page when changing page size
    }
  }
  // Status cell renderer
  const statusCellRenderer = (params: any) => {
    return (
      <div className='flex items-center justify-center'>
        <Toggle
          disabled
          checked={params.value}
          className={'switch-user-status'}
          icons={false}
          id={`status-${params.data.user_id}`}
        />
      </div>
    )
  }

  const handleAddRole = () => {
    setIsEditMode(false)
    setIsOpen(true)
  }

  const handleDeleteRoleConfirmation = (params: any) => {
    setIsOpenConfirmation(true)
    setSelectedRole(params.data)
  }

  // Handle delete user
  const handleDeleteRole = async (params: any) => {
    if (!selectedRole?.role_id) {
      return
    }
    try {
      setLoading(true)
      const response = await adminDashboardDataService.DeletRole(
        selectedRole.role_id,
        false
      )
      toast.success('Deleted Successfully')
      fetchRoles(currentPage, pageSize)
    } catch {
      toast.error('Delete Roles failed')
    } finally {
      setIsOpenConfirmation(false)
      setLoading(false)
    }
  }

  // Action cell renderer wrapper that uses the shared component
  const actionCellRenderer = (params: any) => {
    return (
      <ActionCell
        data={params.data}
        showEdit={false}
        onDelete={() => handleDeleteRoleConfirmation(params)}
      />
    )
  }

  const columnDefs: ColDef[] = [
    {
      field: 'role_id',
      headerName: 'R.Id',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 100
    },
    {
      field: 'role_name',
      headerName: 'Role name',
      sortable: true
    },
    {
      field: 'created_on',
      headerName: 'Created on',
      sortable: true,
      width: 120,
      cellClass: 'text-center'
    }
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   sortable: false,
    //   filter: false,
    //   cellRenderer: actionCellRenderer,
    //   width: 100
    // }
  ]

  const fetchSuggestions = useCallback(
    async (query: string): Promise<SearchItem[]> => {
      if (!query.trim()) {
        return []
      }
      try {
        const response = await adminDashboardDataService.searchValues(
          SearchTableName.ROLE,
          query
        )
        // Check if response is an array
        if (!Array.isArray(response)) {
          console.error('Response is not an array:', response)
          return []
        }

        const suggestions = response.map((item: any) => ({
          id: item.id,
          title: item.label
        }))

        return suggestions
      } catch (error) {
        console.error('Error fetching role suggestions:', error)
        return []
      }
    },
    []
  )

  return (
    <div className='flex flex-col space-y-4 p-4'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <label className='text-2xl font-semibold'>Roles </label>
          <SearchComponent
            placeholder='Search Role'
            fetchSuggestions={fetchSuggestions}
            onSelect={item => fetchRoles(1, pageSize, item.id)}
          />
        </div>
        <Button className='flex items-center space-x-2' onClick={handleAddRole}>
          <i className='fa-solid fa-plus'></i>
          <span>Add</span>
        </Button>
      </div>

      <div style={{ height: 'calc(100vh - 220px)', width: '100%' }}>
        <DataGrid
          loading={loading}
          columnDefs={columnDefs}
          rowData={roles}
          rowSelection='multiple'
          onGridReady={onGridReady}
          suppressMenuHide={false}
          suppressFloatingFilter={false}
          isSummaryGrid={true}
          height='100%'
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading Roles...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="ag-overlay-no-rows-center">No Roles found</span>'
          }
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            filter: true
          }}
        />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <TaDialog
        title={isEditMode ? 'Edit Role' : 'Add Role'}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <RoleForm
          setIsOpen={setIsOpen}
          isEditMode={isEditMode}
          onFormSuccess={isSuccess => isSuccess && fetchRoles(1, pageSize)}
        />
      </TaDialog>

      <TaDialog
        title={'Delete Confirmation'}
        isOpen={isOpenConfirmation}
        onClose={() => setIsOpenConfirmation(false)}
      >
        <div className='w-full'>
          <label htmlFor='Delete confirmation'>
            Are you sure you want to delete?
          </label>
          <div className='mt-6 grid grid-cols-2 gap-4'>
            <Button
              onClick={() => setIsOpenConfirmation(false)}
              size={'3'}
              color='gray'
              variant='solid'
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteRole}
              type='submit'
              size={'3'}
              color='teal'
              variant='solid'
            >
              Yes
            </Button>
          </div>
        </div>
      </TaDialog>
    </div>
  )
}

export default RoleList
