'use client'

import { useState, useRef, useEffect } from 'react'
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { DataGrid } from '../../data-grid'
import { Button } from '@radix-ui/themes/components/button'
import Toggle from 'react-toggle'
import SearchComponent from '../../shared/ta-search/ta-search'
import ActionCell from '../action-cell'
import { TaDialog } from '../../shared/ta-dialog/ta-dialog'
import { UserForm, UserFormData } from './user-form'

// Updated User interface to match UserFormData
interface User {
  user_id: number
  first_name: string
  last_name: string
  role_id: string
  role_name: string
  is_super_admin: boolean
  user_type: string
  email: string
  is_status: boolean
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [pageSize, setPageSize] = useState<number>(25)
  const gridRef = useRef<GridApi | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null)

  // Mock data updated to match UserFormData structure
  useEffect(() => {
    setLoading(true)
    // Simulating API fetch with data matching UserFormData
    const mockUsers = [
      {
        user_id: 512,
        first_name: 'John',
        last_name: 'Doe',
        role_id: '1',
        role_name: 'Admin',
        is_super_admin: true,
        user_type: 'internal',
        email: 'john.doe@example.com',
        is_status: true
      },
      {
        user_id: 515,
        first_name: 'Jane',
        last_name: 'Smith',
        role_id: '2',
        role_name: 'Admin',
        is_super_admin: false,
        user_type: 'external',
        email: 'jane.smith@example.com',
        is_status: true
      },
      {
        user_id: 445,
        first_name: 'Michael',
        last_name: 'Johnson',
        role_id: '3',
        role_name: 'Admin',
        is_super_admin: false,
        user_type: 'internal',
        email: 'michael.johnson@example.com',
        is_status: true
      },
      {
        user_id: 557,
        first_name: 'Emily',
        last_name: 'Williams',
        role_id: '4',
        role_name: 'Admin',
        is_super_admin: false,
        user_type: 'contractor',
        email: 'emily.williams@example.com',
        is_status: false
      }
    ]
    setUsers(mockUsers)
    setLoading(false)
  }, [])

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api
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

  // Handle edit user
  const handleEditUser = (params: any) => {
    setSelectedUser(params.data)
    setIsEditMode(true)
    setIsOpen(true)
    console.log('Edit user:', params.data)
  }

  // Handle add user
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    setIsOpen(true);
  }

  // Handle delete user
  const handleDeleteUser = (params: any) => {
    console.log('Delete user:', params.data)
    // Implement your delete logic here
  }

  // Action cell renderer wrapper that uses the shared component
  const actionCellRenderer = (params: any) => {
    return (
      <ActionCell
        data={params.data}
        onEdit={() => handleEditUser(params)}
        onDelete={() => handleDeleteUser(params)}
      />
    )
  }

  // Full name getter for the grid
  const getFullName = (params: any) => {
    return `${params.data.first_name} ${params.data.last_name}`
  }

  const columnDefs: ColDef[] = [
    {
      field: 'user_id',
      headerName: 'U.ID',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 100
    },
    {
      headerName: 'Full Name',
      valueGetter: getFullName,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'email',
      headerName: 'Email',
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'role_name',
      headerName: 'Role',
      sortable: true
    },
    {
      field: 'is_super_admin',
      headerName: 'Super Admin',
      sortable: true,
      cellRenderer: (cell: any) => <>{cell.value ? 'Yes' : 'No'}</>,
      width: 150,
      cellClass: 'text-center'
    },
    {
      field: 'user_type',
      headerName: 'User Type',
      sortable: true
    },
    {
      field: 'is_status',
      headerName: 'Status',
      sortable: true,
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

  return (
    <div className='flex flex-col space-y-4 p-4'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <label className='text-2xl font-semibold'>Users</label>
          <SearchComponent />
        </div>
        <Button className='flex items-center space-x-2' onClick={handleAddUser}>
          <i className='fa-solid fa-plus'></i>
          <span>Add</span>
        </Button>
      </div>

      <div style={{ height: 'calc(100vh - 220px)', width: '100%' }}>
        <DataGrid
          columnDefs={columnDefs}
          rowData={users}
          pagination={true}
          paginationPageSize={pageSize}
          rowSelection='multiple'
          onGridReady={onGridReady}
          suppressMenuHide={false}
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
            filter: true
          }}
        />
      </div>

      <TaDialog
        title={isEditMode ? 'Edit User' : 'Add User'}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <UserForm
          setIsOpen={setIsOpen}
          isEditMode={isEditMode}
          user={selectedUser}
        />
      </TaDialog>
    </div>
  )
}

export default UserList
