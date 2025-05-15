'use client'

import React from 'react'

interface ActionCellProps {
  onEdit?: (data: any) => void
  onDelete?: (data: any) => void
  data?: any
  editTooltip?: string
  deleteTooltip?: string
  showEdit?: boolean
  showDelete?: boolean
}

const ActionCell = ({
  onEdit,
  onDelete,
  data,
  editTooltip = 'Edit',
  deleteTooltip = 'Delete',
  showEdit = true,
  showDelete = true
}: ActionCellProps) => {
  return (
    <div className="flex justify-center space-x-4">
      {showEdit && (
        <button 
          className="text-blue-400 hover:text-blue-600 cursor-pointer" 
          title={editTooltip}
          onClick={() => onEdit && onEdit(data)}
        >
          <i className="fa-solid fa-pen-to-square text-lg"></i>
        </button>
      )}
      
      {showDelete && (
        <button 
          className="text-red-400 hover:text-red-600 cursor-pointer" 
          title={deleteTooltip}
          onClick={() => onDelete && onDelete(data)}
        >
          <i className="fa-solid fa-trash-can text-lg"></i>
        </button>
      )}
    </div>
  )
}

export default ActionCell