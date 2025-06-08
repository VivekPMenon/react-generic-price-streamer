'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Button, Checkbox } from '@radix-ui/themes'
import { IColumnItem } from './model'

interface ColumnManagementProps {
  availableColumns: IColumnItem[]
  currentColumns: IColumnItem[]
  onClose?: () => void
  onUpdateColumn?: (column: IColumnItem) => Promise<void>
  onBulkUpdateColumns?: (columns: IColumnItem[]) => Promise<void>
}

// Memoized Sortable Item Component with virtualization-friendly structure
const SortableColumnItem = React.memo<{
  item: IColumnItem
  index: number
  onToggle: (index: number, checked: boolean) => void
}>(({ item, index, onToggle }) => {
  // Use refs to avoid creating new functions on each render
  const onToggleRef = useRef(onToggle)
  onToggleRef.current = onToggle

  const handleToggle = useCallback(
    (checked: boolean | string) => {
      onToggleRef.current(index, !!checked)
    },
    [index]
  )

  // Add console log here to inspect item.is_selected
  console.log(`Column: ${item.headerName || item.label}, is_selected: ${item.is_selected}`)

  return (
    <div
      className={`flex items-center bg-[#1F2937] p-2 rounded-sm hover:bg-[#374151] transition-colors cursor-move`}
    >
      <div className='flex items-center flex-1 min-w-0'>
        <Checkbox
          checked={item.is_selected}
          onCheckedChange={handleToggle}
          className='mr-3 flex-shrink-0'
        />
        <span
          className='truncate text-white text-sm leading-tight min-w-0 flex-1'
          title={item.headerName || item.label}
        >
          {item.headerName || item.label}
        </span>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.item.is_selected === nextProps.item.is_selected &&
    prevProps.item.id === nextProps.item.id &&
    prevProps.index === nextProps.index &&
    (prevProps.item.headerName || prevProps.item.label) === 
    (nextProps.item.headerName || nextProps.item.label)
  )
})

SortableColumnItem.displayName = 'SortableColumnItem'

const ColumnManagement: React.FC<ColumnManagementProps> = ({
  availableColumns,
  currentColumns,  
  onClose,
  onUpdateColumn,
  onBulkUpdateColumns
}) => {
  const [columnList, setColumnList] = useState<IColumnItem[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  // Cache field names for faster lookups
  const currentColumnFieldsSet = useMemo(() => {
    return new Set(
      currentColumns
        .map(col => col.field || col.label)
        .filter(Boolean)
    )
  }, [currentColumns])

  // Memoize the initialization logic with stable reference
  const initializedColumns = useMemo(() => {
    const columnsWithSelection: IColumnItem[] = availableColumns
      .filter(col => col.id) // Only include items that have an id
      .map(col => {
        // const fieldName = col.field || col.label!
        return {
          ...col,
          is_selected: col.is_selected // Directly use is_selected from API response
        }
      })

    return columnsWithSelection.sort((a, b) => {
      const orderA = a.order_id ?? 0
      const orderB = b.order_id ?? 0
      return orderA - orderB
    })
  }, [availableColumns])

  // Use ref to track if initial load is done to prevent unnecessary updates
  // const isInitializedRef = useRef(false)

  useEffect(() => {
    // if (!isInitializedRef.current) {
      setColumnList(initializedColumns)
      // isInitializedRef.current = true
    // }
  }, [initializedColumns])

  // Optimized column change handler using functional update pattern
  const handleColumnChange = useCallback(
    (index: number, checked: boolean) => {
      setColumnList(prev => {
        // Only update if the value actually changed
        if (prev[index]?.is_selected === checked) {
          return prev
        }
        
        const newList = [...prev]
        newList[index] = { ...newList[index], is_selected: checked }
        return newList
      })
    },
    []
  )

  // Stable callback references
  const handleApply = useCallback(async () => {
    try {
      setIsUpdating(true)

      if (onBulkUpdateColumns) {
        await onBulkUpdateColumns(columnList)
      }


      onClose?.()
    } catch (error) {
      console.error('Failed to apply column changes:', error)
    } finally {
      setIsUpdating(false)
    }
  }, [columnList, onBulkUpdateColumns, onClose])

  const handleSelectAll = useCallback(() => {
    setColumnList(prev => 
      prev.some(item => !item.is_selected) 
        ? prev.map(item => ({ ...item, is_selected: true }))
        : prev // No change needed if all already selected
    )
  }, [])

  const handleDeselectAll = useCallback(() => {
    setColumnList(prev => 
      prev.some(item => item.is_selected)
        ? prev.map(item => ({ ...item, is_selected: false }))
        : prev // No change needed if all already deselected
    )
  }, [])

  // Memoize counts with more granular dependency
  const { selectedCount, totalCount, allSelected } = useMemo(() => {
    let selected = 0
    const total = columnList.length
    
    for (const item of columnList) {
      if (item.is_selected) selected++
    }
    
    return {
      selectedCount: selected,
      totalCount: total,
      allSelected: selected === total && total > 0
    }
  }, [columnList])

  // Batch DOM updates by using a stable key for the list
  const listKey = useMemo(() => {
    return columnList.map(item => `${item.id}-${item.is_selected}`).join('|')
  }, [columnList])

  return (
    <div className='p-4 w-[75vw]'>
      <div className='mb-4'>
        <p className='text-sm text-gray-400 mb-3'>
          Select columns to display and drag to reorder them
        </p>
        <div className='flex gap-2 mb-4 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Checkbox
              checked={allSelected}
              onCheckedChange={value =>
                value ? handleSelectAll() : handleDeselectAll()
              }
              className='mr-1'
            />
            <span>Select All</span>
          </div>
          <span className='text-sm text-gray-400'>
            {selectedCount} of {totalCount} selected
          </span>
        </div>
      </div>

      <section 
        key={listKey}
        className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 scrollable-div'
      >
        {columnList.map((item, index) => (
          <SortableColumnItem
            key={item.id}
            item={item}
            index={index}
            onToggle={handleColumnChange}
          />
        ))}
      </section>

      <div className='flex justify-end gap-2 mt-6 pt-4'>
        <Button
          onClick={onClose}
          size={'3'}
          color='gray'
          variant='solid'
          disabled={isUpdating}
        >
          Cancel
        </Button>

        <Button
          onClick={handleApply}
          type='submit'
          size={'3'}
          color='teal'
          variant='solid'
          disabled={selectedCount === 0 || isUpdating}
          loading={isUpdating}
        >
          Update
        </Button>
      </div>
    </div>
  )
}

export default React.memo(ColumnManagement)