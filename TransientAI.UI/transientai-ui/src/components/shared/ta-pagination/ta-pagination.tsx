'use client'

import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  pageSizeOptions: number[]
  totalItems: number
  loading?: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const CustomPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  totalItems,
  loading,
  onPageChange,
  onPageSizeChange
}) => {
  // Calculate visible pages (show 5 page numbers at a time)
  const getVisiblePages = () => {
    const pages = []
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)
    
    // Adjust start page if we're near the end
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()
  
  // Calculate record range being displayed
  const startRecord = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col md:flex-row justify-end items-center gap-6 w-full mt-4 text-sm">
      {/* Page size selector */}
      <div className="flex items-center">
        <span className="mr-2">Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={loading}
          className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Page information */}
      <div className="text-gray-600 dark:text-gray-300">
        {startRecord} - {endRecord} of {totalItems}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || loading}
          className={`px-3 py-1 rounded-l border ${
            currentPage === 1 || loading
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}
        >
          <i className="fa-solid fa-angles-left"></i>
        </button>

        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={`px-3 py-1 border ${
            currentPage === 1 || loading
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}
        >
          <i className="fa-solid fa-angle-left"></i>
        </button>

        {/* Page numbers */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`px-3 py-1 border ${
              loading
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600'
                : currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0 || loading}
          className={`px-3 py-1 border ${
            currentPage === totalPages || totalPages === 0 || loading
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}
        >
          <i className="fa-solid fa-angle-right"></i>
        </button>

        {/* Last page button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0 || loading}
          className={`px-3 py-1 rounded-r border ${
            currentPage === totalPages || totalPages === 0 || loading
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}
        >
          <i className="fa-solid fa-angles-right"></i>
        </button>
      </div>
    </div>
  )
}

export default CustomPagination