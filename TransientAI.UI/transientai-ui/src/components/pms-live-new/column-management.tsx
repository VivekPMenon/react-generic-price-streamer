'use client'

import React, { useState, useEffect } from 'react'
import { ColDef } from 'ag-grid-community'
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

interface ColumnItem {
  id: string
  field: string
  headerName: string
  is_assigned: boolean
}

interface ColumnManagementProps {
  availableColumns: ColDef[]
  currentColumns: ColDef[]
  onColumnsChange: (selectedColumns: ColDef[]) => void
  onClose?: () => void
}

// Sortable Item Component
const SortableColumnItem: React.FC<{
  item: ColumnItem
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
  } = useSortable({ id: item.id, disabled: !item.is_assigned })

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
          checked={item.is_assigned}
          onCheckedChange={checked => onToggle(index, checked)}
          className='mr-3'
          onClick={e => e.stopPropagation()} // Prevent drag when clicking checkbox
        />
        <span className='truncate text-white flex-1' title={item.headerName}>
          {item.headerName}
        </span>
      </div>
    </div>
  )
}

const ColumnManagement: React.FC<ColumnManagementProps> = ({
  availableColumns,
  currentColumns,
  onColumnsChange,
  onClose
}) => {
  const [columnList, setColumnList] = useState<ColumnItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

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
    // Initialize column list with current selection state and preserve order
    const initializeColumns = () => {
      const currentFields = currentColumns
        .map(col => col.field)
        .filter((field): field is string => !!field)

      // Create a map of current column order
      const currentOrderMap = new Map()
      currentColumns.forEach((col, index) => {
        if (col.field) {
          currentOrderMap.set(col.field, index)
        }
      })

      const columns = availableColumns
        .filter(col => col.field)
        .map((col, index) => ({
          id: col.field!, // Using field as unique ID
          field: col.field!,
          headerName: col.headerName || col.field || '',
          is_assigned: currentFields.includes(col.field!)
        }))

      // Sort columns: selected columns first (in their current order), then unselected
      const selectedColumns = columns
        .filter(col => col.is_assigned)
        .sort((a, b) => {
          const orderA = currentOrderMap.get(a.field) ?? 999
          const orderB = currentOrderMap.get(b.field) ?? 999
          return orderA - orderB
        })

      const unselectedColumns = columns.filter(col => !col.is_assigned)

      setColumnList([...selectedColumns, ...unselectedColumns])
    }

    initializeColumns()
  }, [availableColumns, currentColumns])

  useEffect(() => {
    console.log(columnList)
  }, [columnList])

  const handleColumnChange = (index: number, checked: boolean | string) => {
    setColumnList(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, is_assigned: !!checked } : item
      )
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setColumnList(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }

  const handleApply = () => {
    // Get selected fields in the order they appear in the list
    const selectedFields = columnList
      .filter(item => item.is_assigned)
      .map(item => item.field)

    // Preserve the order as arranged by the user
    const selectedColumns = selectedFields
      .map(field => availableColumns.find(col => col.field === field))
      .filter((col): col is ColDef => !!col)

    onColumnsChange(selectedColumns)
    if (onClose) onClose()
  }

  const handleSelectAll = () => {
    setColumnList(prev => prev.map(item => ({ ...item, is_assigned: true })))
  }

  const handleDeselectAll = () => {
    setColumnList(prev => prev.map(item => ({ ...item, is_assigned: false })))
  }

  const activeItem = activeId
    ? columnList.find(item => item.id === activeId)
    : null

  return (
    <div className='p-4 w-[75vw]'>
      <div className='mb-4'>
        <p className='text-sm text-gray-400 mb-3'>
          Select columns to display and drag to reorder them
        </p>
        <div className='flex gap-2 mb-4 items-center'>
          <Checkbox
            onCheckedChange={value =>
              value ? handleSelectAll() : handleDeselectAll()
            }
            className='mr-1'
          />
         <span> Select All</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columnList.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <section className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto'>
            {columnList.map((item, index) => (
              <SortableColumnItem
                key={item.id}
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
                <Checkbox
                  checked={activeItem.is_assigned}
                  className='mr-3'
                  disabled
                />
                <span className='truncate text-white flex-1'>
                  {activeItem.headerName}
                </span>
              </div>
              <div className='ml-2 text-gray-400'>
                <i className="fa-solid fa-grip-vertical"></i>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className='flex justify-end gap-2 mt-6 pt-4'>
        <Button onClick={onClose} size={'3'} color='gray' variant='solid'>
          Cancel
        </Button>

        <Button
          onClick={handleApply}
          type='submit'
          size={'3'}
          color='teal'
          variant='solid'
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default ColumnManagement
