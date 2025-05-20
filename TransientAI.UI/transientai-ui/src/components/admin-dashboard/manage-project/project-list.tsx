'use client'

import { useState, useRef, useEffect } from 'react'
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { DataGrid } from '../../data-grid'
import { Button } from '@radix-ui/themes/components/button'
import Toggle from 'react-toggle'
import SearchComponent from '../../shared/ta-search/ta-search'
import ActionCell from '../action-cell'

interface Project {
  project_id: number
  project_name: string
  created_on: string
}

const ProjectList = () => {
  const [projects, setPrjects] = useState<Project[]>([])
  const [pageSize, setPageSize] = useState<number>(25)
  const gridRef = useRef<GridApi | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    const mockProjects = [
      {
        project_id: 1,
        project_name: "By Side",
        created_on: '14 May 2025'
      },
      {
        project_id: 2,
        project_name: "Sell Side",
        created_on: '14 May 2025'
      }
    ]

    setPrjects(mockProjects)
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

  const handleAddRole = () => {
    setIsEditMode(false)
    setIsOpen(true)
  }

  // Handle delete user
  const handleEditProject = (params: any) => {
    console.log('Delete user:', params.data)
    // Implement your delete logic here
  }

  // Action cell renderer wrapper that uses the shared component
  const actionCellRenderer = (params: any) => {
    return (
      <ActionCell
        data={params.data}
        showDelete={false}
        onEdit={() => handleEditProject(params)}
      />
    )
  }

  // Full name getter for the grid
  const getFullName = (params: any) => {
    return `${params.data.first_name} ${params.data.last_name}`
  }

  const columnDefs: ColDef[] = [
    {
      field: 'project_id',
      headerName: 'P.Id',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 100
    },
    {
      field: 'project_name',
      headerName: 'Project name',
      sortable: true
    },
    {
      field: 'created_on',
      headerName: 'Created on',
      sortable: true,
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
          <label className='text-2xl font-semibold'>Projects </label>
          <SearchComponent />
        </div>
        {/* <Button className='flex items-center space-x-2' onClick={handleAddRole}>
          <i className='fa-solid fa-plus'></i>
          <span>Add</span>
        </Button> */}
      </div>

      <div style={{ height: 'calc(100vh - 220px)', width: '100%' }}>
        <DataGrid
          columnDefs={columnDefs}
          rowData={projects}
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


    </div>
  )
}

export default ProjectList
