'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { DataGrid } from '../../data-grid'
import { Button } from '@radix-ui/themes/components/button'
import Toggle from 'react-toggle'
import SearchComponent, { SearchItem } from '../../shared/ta-search/ta-search'
import ActionCell from '../action-cell'
import { TaDialog } from '../../shared/ta-dialog/ta-dialog'
import { UserForm } from './user-form'
import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service'
import CustomPagination from '@/components/shared/ta-pagination/ta-pagination'
import { toast } from 'react-toastify'
import { SearchQueryType, SearchTableName } from '@/services/admin-dashboard/model'

// Updated User interface to match UserFormData
interface User {
  user_id: number
  full_name: string
  first_name: string
  last_name: string
  role_id: string
  role_name: string
  is_super_admin: boolean
  user_type: string
  email: string
  is_active: boolean
}

const UserList = () => {
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [users, setUsers] = useState<User[]>([])
  const gridRef = useRef<GridApi | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const pageSizeOptions = [10, 25, 50, 100]
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    fetchUsers(currentPage, pageSize)
  }, [])

  const fetchUsers = async (page: number, size: number, searchUserId?: number) => {
    setLoading(true)
    try {
      // Call your API service with pagination parameters
      const response = await adminDashboardDataService.getUserList(page, size,false,searchUserId);

      // Update users and pagination data from the response
      setUsers(response.data || [])

      // Update pagination state from API response
      const pagination = response.pagination || {
        currentPage: 1,
        totalPages: 1,
        total_items: response.data?.length || 0,
        pageSize: size
      }

      setCurrentPage(pagination.page)
      setTotalPages(pagination.total_pages)
      setTotalItems(pagination.total_items)
      setPageSize(pagination.page_size)
    } catch (error) {
      console.error('Error fetching users:', error)
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
      fetchUsers(page, pageSize)
    }
  }

  // Handle page size change from custom pagination
  const handlePageSizeChange = (size: number) => {
    if (size !== pageSize) {
      fetchUsers(1, size) // Reset to first page when changing page size
    }
  }

  const statusCellRenderer = (params: any) => {
    const [isActive, setIsActive] = useState(params.value)

    const handleToggleChange = async (checked: boolean) => {
      // Optimistically update UI first
      setIsActive(checked)

      try {
        // Call the API to update status
        await adminDashboardDataService.UpdateActive(
          params.data.user_id,
          checked
        )
        toast.success('Active updated successfully')

        // No need to call fetchUsers - we already updated local state
      } catch (error) {
        // Revert UI state if API call fails
        setIsActive(!checked)
        toast.error('Failed to update status')
      }
    }

    return (
      <div className='flex items-center justify-center'>
        <Toggle
          onChange={e => {
            e.preventDefault()
            handleToggleChange(e.target.checked)
          }}
          checked={isActive} // Use controlled component pattern
          className={'switch-user-status'}
          icons={false}
          id={`status-${params.data.user_id}`}
        />
      </div>
    )
  }

  // Handle edit user
  const handleEditUser = (params: any) => {
    setSelectedUser(params.data)
    setIsEditMode(true)
    setIsOpenForm(true)
  }

  // Handle add user
  const handleAddUser = () => {
    setSelectedUser(null)
    setIsEditMode(false)
    setIsOpenForm(true)
  }

  const handleDeleteUserConfirmation = (params: any) => {
    setIsOpenConfirmation(true)
    setSelectedUser(params.data)
  }

  // Handle delete user
  const handleDeleteUser = async (params: any) => {
    if (!selectedUser?.user_id) {
      return
    }
    try {
      setLoading(true)
      const response = await adminDashboardDataService.DeletUser(
        selectedUser.user_id,
        selectedUser.is_active
      )
      toast.success('Deleted Successfully')
      fetchUsers(currentPage, pageSize)
    } catch {
      toast.error('Delete user failed')
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
        onEdit={() => handleEditUser(params)}
        showDelete={false}
        // onDelete={() => handleDeleteUserConfirmation(params)}
      />
    )
  }

  const columnDefs: ColDef[] = [
    {
      field: 'user_id',
      headerName: 'U.ID',
     sortable: false,
      filter: false,
      width: 100
    },
    {
      headerName: 'Full Name',
      field: 'full_name',
      sortable: false,
      filter: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      sortable: false,
      filter: false,
    },
    {
      field: 'role',
      headerName: 'Role',
      sortable: false,
      filter: false,
    },
    {
      field: 'is_super_admin',
      headerName: 'Super Admin',
      sortable: false,
      filter: false,
      cellRenderer: (cell: any) => <>{cell.value ? 'Yes' : 'No'}</>,
      width: 150,
      cellClass: 'text-center'
    },
    {
      field: 'user_type',
      headerName: 'User Type',
      sortable: false,
      filter: false,
    },
    {
      field: 'is_active',
      headerName: 'Active',
      sortable: false,
      filter: false,
      cellRenderer: statusCellRenderer,
      width: 120,
      cellClass: 'text-center'
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filter: false,
      cellRenderer: actionCellRenderer,
      width: 100
    }
  ]

  const fetchSuggestions = useCallback(
    async (query: string): Promise<SearchItem[]> => {
      if (!query.trim()) {
        return []
      }
      try {
        const response = await adminDashboardDataService.searchValues(
          SearchTableName.USER,
          query,
          SearchQueryType.FULLNAME
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
          <label className='text-2xl font-semibold'>Users</label>
          <SearchComponent
            placeholder='Search User'
            fetchSuggestions={fetchSuggestions}
            onSelect={item => fetchUsers(1, pageSize, item.id)}
          />
        </div>
        <Button className='flex items-center space-x-2' onClick={handleAddUser}>
          <i className='fa-solid fa-plus'></i>
          <span>Add</span>
        </Button>
      </div>

      <div style={{ height: 'calc(100vh - 220px)', width: '100%' }}>
        <DataGrid
          loading={loading}
          columnDefs={columnDefs}
          rowData={users}
          rowSelection='multiple'
          onGridReady={onGridReady}
          suppressMenuHide={false}
          isNewGrid={true}
          suppressFloatingFilter={false}
          isSummaryGrid={true}
          height='100%'
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading users...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="ag-overlay-no-rows-center">No users found</span>'
          }
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            filter: true,
            suppressMenu: true
          }}
        />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          totalItems={totalItems}
          loading={loading}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <TaDialog
        title={isEditMode ? 'Edit User' : 'Add User'}
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
      >
        <UserForm
          setIsOpen={setIsOpenForm}
          isEditMode={isEditMode}
          user_id={selectedUser?.user_id}
          onFormSuccess={isSuccess => isSuccess && fetchUsers(1, pageSize)}
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
              onClick={handleDeleteUser}
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

export default UserList
