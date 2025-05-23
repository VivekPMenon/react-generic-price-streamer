'use client'

import { useState, useRef, useEffect } from 'react'
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { DataGrid } from '../../data-grid'
import Toggle from 'react-toggle'
import SearchComponent from '../../shared/ta-search/ta-search'
import ActionCell from '../action-cell'
import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service'
import CustomPagination from '@/components/shared/ta-pagination/ta-pagination'
import { useRouter } from 'next/navigation'

const mockProjects = [
  {
    project_id: 1,
    project_name: 'By Side',
    created_on: '14 May 2025'
  }
]

interface Project {
  project_id: number
  project_name: string
  created_on: string
}

const ProjectList = () => {
  const pageSizeOptions = [10, 25, 50, 100]
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(1)
  const [projects, setPrjects] = useState<Project[]>(mockProjects)
  const gridRef = useRef<GridApi | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // fetchProjects(currentPage, pageSize);
  }, [])

  const fetchProjects = async (page: number, size: number, query = '') => {
    setLoading(true)
    try {
      // Call your API service with pagination parameters
      const response = await adminDashboardDataService.getProjectsList(
        page,
        size
      )

      // Update users and pagination data from the response
      setPrjects(response.data || [])

      // Update pagination state from API response
      const pagination = response.pagination || {
        page: 1,
        total_pages: 1,
        total_projects: response.data?.length || 0,
        page_size: size
      }

      setCurrentPage(pagination.page)
      setTotalPages(pagination.total_pages)
      setTotalItems(pagination.total_projects)
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
      fetchProjects(page, pageSize)
    }
  }

  // Handle page size change from custom pagination
  const handlePageSizeChange = (size: number) => {
    if (size !== pageSize) {
      fetchProjects(1, size) // Reset to first page when changing page size
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

  const handleAddProject = () => {
    setIsEditMode(false)
    setIsOpen(true)
  }

  // Handle delete user
  const handleEditProject = (params: any) => {
    router.push('/admin-dashboard/project-management/edit')
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

  const columnDefs: ColDef[] = [
    {
      field: 'project_id',
      headerName: 'P.Id',
      sortable: false,
      filter: false,
      width: 100
    },
    {
      field: 'project_name',
      headerName: 'Project Name',
      sortable: false,
      filter: false
    },
    {
      field: 'created_on',
      headerName: 'Created On',
      sortable: false,
      filter: false,
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
          {/* <SearchComponent /> */}
        </div>
        {/* <Button className='flex items-center space-x-2' onClick={handleAddProject}>
          <i className='fa-solid fa-plus'></i>
          <span>Add</span>
        </Button> */}
      </div>

      <div style={{ height: 'calc(100vh - 220px)', width: '100%' }}>
        <DataGrid
          columnDefs={columnDefs}
          rowData={projects}
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
    </div>
  )
}

export default ProjectList
