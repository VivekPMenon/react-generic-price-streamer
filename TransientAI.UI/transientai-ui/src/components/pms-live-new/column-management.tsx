'use client'

import React, { useState, useEffect } from 'react'
import { Button, Checkbox } from '@radix-ui/themes'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IColumnItem } from './model'

interface ColumnManagementProps {
  availableColumns: IColumnItem[]
  currentColumns: IColumnItem[]
  onColumnsChange: (selectedColumns: IColumnItem[]) => void
  onClose?: () => void
  onUpdateColumn?: (column: IColumnItem) => Promise<void> // API call for individual column updates
  onBulkUpdateColumns?: (columns: IColumnItem[]) => Promise<void> // API call for bulk updates
}

// Sortable Item Component
const SortableColumnItem: React.FC<{
  item: IColumnItem
  index: number
  onToggle: (index: number, checked: boolean | string) => void
}> = ({ item, index, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: item.id || item.field || item.column_name!, 
    disabled: item.is_frozen 
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center bg-[#1F2937] p-4 rounded-sm hover:bg-[#374151] transition-colors cursor-move ${
        isDragging ? 'z-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className='flex items-center flex-1'>
        <div className='mr-2 text-gray-400 opacity-60'>
         <i className="fa-solid fa-grip-vertical"></i>
        </div>
        <Checkbox
          checked={item.is_selected}
          onCheckedChange={checked => onToggle(index, checked)}
          className='mr-3'
          onClick={e => e.stopPropagation()} // Prevent drag when clicking checkbox
        />
        <span className='truncate text-white flex-1' title={item.headerName || item.column_name}>
          {item.headerName || item.column_name}
        </span>
      </div>
    </div>
  )
}

const ColumnManagement: React.FC<ColumnManagementProps> = ({
  availableColumns,
  currentColumns,
  onColumnsChange,
  onClose,
  onUpdateColumn,
  onBulkUpdateColumns
}) => {
  const [columnList, setColumnList] = useState<IColumnItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    // Initialize column list with current selection state and preserve order based on order_id
    const initializeColumns = () => {
      // Create a set of currently selected column names for quick lookup
      const currentColumnFields = new Set(
        currentColumns
          .map(col => col.field || col.column_name)
          .filter(Boolean)
      )

      // Transform available columns with selection state
      const columnsWithSelection: IColumnItem[] = availableColumns
        .filter(col => col.field || col.column_name) // Only include columns with field names
        .map(col => {
          const fieldName = col.field || col.column_name!
          return {
            ...col,
            id: col.id || fieldName, // Use existing id or field name as fallback
            is_selected: currentColumnFields.has(fieldName)
          }
        })

      // Sort all columns by order_id only - both selected and unselected together
      const sortedColumns = columnsWithSelection.sort((a, b) => {
        const orderA = a.order_id ?? 0
        const orderB = b.order_id ?? 0
        return orderA - orderB
      })

      setColumnList(sortedColumns)
    }

    initializeColumns()
  }, [availableColumns, currentColumns])

  const handleColumnChange = (index: number, checked: boolean | string) => {
    setColumnList(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, is_selected: !!checked } : item
      )
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = columnList.findIndex(item => (item.id || item.field || item.column_name) === active.id)
      const newIndex = columnList.findIndex(item => (item.id || item.field || item.column_name) === over.id)
      
      const newItems = arrayMove(columnList, oldIndex, newIndex)
      
      // Update order_id for ALL items based on their new positions
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order_id: index + 1
      }))

      setColumnList(updatedItems)
    }

    setActiveId(null)
  }

  const handleApply = async () => {
    try {
      setIsUpdating(true)
      
      // Call API to update all columns with their current state
      if (onBulkUpdateColumns) {
        await onBulkUpdateColumns(columnList)
      }
      
      // Get selected columns for the parent component
      const selectedColumns = columnList.filter(item => item.is_selected)
      onColumnsChange(selectedColumns)
      
      if (onClose) onClose()
    } catch (error) {
      console.error('Failed to apply column changes:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSelectAll = () => {
    setColumnList(prev => prev.map(item => ({ ...item, is_selected: true })))
  }

  const handleDeselectAll = () => {
    setColumnList(prev => prev.map(item => ({ ...item, is_selected: false })))
  }

  const activeItem = activeId
    ? columnList.find(item => (item.id || item.field || item.column_name) === activeId)
    : null

  // Count selected columns
  const selectedCount = columnList.filter(item => item.is_selected).length
  const totalCount = columnList.length

  return (
    <div className='p-4 w-[75vw]'>
      <div className='mb-4'>
        <p className='text-sm text-gray-400 mb-3'>
          Select columns to display and drag to reorder them
        </p>
        <div className='flex gap-2 mb-4 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Checkbox
              checked={selectedCount === totalCount}
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columnList.map(item => (item.id || item.field || item.column_name) as string)}
          strategy={verticalListSortingStrategy}
        >
          <section className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto'>
            {columnList.map((item, index) => (
              <SortableColumnItem
                key={item.id || item.field || item.column_name}
                item={item}
                index={index}
                onToggle={handleColumnChange}
              />
            ))}
          </section>
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div className='flex items-center bg-[#1F2937] p-4 rounded-sm shadow-lg border-2 border-blue-400'>
              <div className='flex items-center flex-1'>
                <div className='mr-2 text-gray-400 opacity-60'>
                  <i className="fa-solid fa-grip-vertical"></i>
                </div>
                <Checkbox
                  checked={activeItem.is_selected}
                  className='mr-3'
                  disabled
                />
                <span className='truncate text-white flex-1'>
                  {activeItem.headerName || activeItem.column_name}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className='flex justify-end gap-2 mt-6 pt-4'>
        <Button onClick={onClose} size={'3'} color='gray' variant='solid' disabled={isUpdating}>
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

export default ColumnManagement