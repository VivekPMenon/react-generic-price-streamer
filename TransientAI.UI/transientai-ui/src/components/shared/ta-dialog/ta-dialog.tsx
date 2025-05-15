import React from 'react'

interface DialogProps {
  title: string
  isOpen: boolean
  onClose?: () => void
  children: React.ReactNode
}

export const TaDialog = ({
  isOpen,
  children,
  title = 'Dialog',
  onClose
}: DialogProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-gray-900 rounded-lg w-full max-w-md p-6 text-white'>
        <div className='flex items-center justify-between mb-6'>
          <label htmlFor='header' className='text-xl font-semibold'>
            {title}
          </label>
          <button
            type='button'
            onClick={onClose}
            className='text-gray-400 hover:text-white'
            aria-label='Close'
          >
            <i className='fa-light fa-circle-xmark'></i>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
