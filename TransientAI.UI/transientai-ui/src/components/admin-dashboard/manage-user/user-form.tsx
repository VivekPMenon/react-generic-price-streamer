import { Button } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Toggle from 'react-toggle'

/**
 * Type for form data structure
 */
export interface UserFormData {
  user_id?: number
  first_name: string
  last_name: string
  role_id: string
  is_super_admin: boolean
  user_type: string
  email: string
  is_status: boolean
}

/**
 * Interface for UserForm props
 */
interface UserFormProps {
  setIsOpen: (isOpen: boolean) => void
  isEditMode: boolean
  user?: UserFormData | null
}

/**
 * User form component for creating and editing user profiles
 */
export const UserForm: React.FC<UserFormProps> = ({
  setIsOpen,
  isEditMode = false,
  user
}) => {
  const defaultValues = {
    first_name: '',
    last_name: '',
    role_id: '',
    user_type: '',
    email: '',
    is_status: false,
    is_super_admin: false
  }

  const onSubmit = (data: UserFormData) => {
    console.log('Form submitted:', data)
    setIsOpen(false)
  }

  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<UserFormData>({ defaultValues })

  useEffect(() => {
    if (isEditMode && user) {
      // Populate form with user data when in edit mode
      reset(user)
    } else {
      // Reset form to default values when in create mode
      reset(defaultValues)
    }
  }, [isEditMode, user, reset])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 w-full bg-gray-900 rounded-lg'
    >
      <div className='relative flex'>
        <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            ></path>
          </svg>
        </div>
        <input
          {...register('first_name', { required: 'First name is required' })}
          placeholder='First Name'
          className='w-full py-3 px-10 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
        />
      </div>

      <div className='relative flex'>
        <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            ></path>
          </svg>
        </div>
        <input
          {...register('last_name', { required: 'Last name is required' })}
          placeholder='Last Name'
          className='w-full py-3 px-10 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
        />
      </div>

      <div className='relative flex'>
        <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400'>
          @
        </div>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type='email'
          placeholder='Admin@hurricanecap.com'
          className='w-full py-3 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 overflow-hidden text-ellipsis'
        />
      </div>

      <div className='relative'>
        <select
          {...register('role_id', { required: 'Role is required' })}
          className='w-full py-3 px-4 bg-gray-800 border border-gray-700 rounded-md text-white appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
        >
          <option value='' disabled>
            Select Role
          </option>
          <option value='admin'>Admin</option>
          <option value='user'>User</option>
          <option value='manager'>Manager</option>
        </select>
        <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
          <svg
            className='w-5 h-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M19 9l-7 7-7-7'
            ></path>
          </svg>
        </div>
      </div>

      <div className='relative'>
        <select
          {...register('user_type', { required: 'User type is required' })}
          className='w-full py-3 px-4 bg-gray-800 border border-gray-700 rounded-md text-white appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
        >
          <option value='' disabled>
            User Type
          </option>
          <option value='internal'>Internal</option>
          <option value='external'>External</option>
          <option value='contractor'>Contractor</option>
        </select>
        <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
          <svg
            className='w-5 h-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M19 9l-7 7-7-7'
            ></path>
          </svg>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div className='mt-4'>
          <p className='text-white mb-2'>Status</p>
          <span className='flex align-middle gap-2'>
            Inactive
            <Controller
              name='is_status'
              control={control}
              render={({ field: { onChange, value } }) => (
                <Toggle
                  onChange={e => onChange(e.target.checked)}
                  checked={value}
                  className={'switch-user-status'}
                  icons={false}
                  id='status-toggle'
                />
              )}
            />
            Active
          </span>
        </div>
        <div className='mt-4'>
          <p className='text-white mb-2'>Is Super Admin</p>
          <span className='flex align-middle gap-2'>
            No{' '}
            <Controller
              name='is_super_admin'
              control={control}
              render={({ field: { onChange, value } }) => (
                <Toggle
                  onChange={e => onChange(e.target.checked)}
                  checked={value}
                  prefix='Inactive'
                  className={'switch-user-status'}
                  icons={false}
                  id='admin-toggle'
                />
              )}
            />{' '}
            Yes{' '}
          </span>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-2 gap-4'>
        <Button
          onClick={() => setIsOpen(false)}
          size={'3'}
          color='gray'
          variant='solid'
        >
          Cancel
        </Button>

        <Button type='submit' size={'3'} color='teal' variant='solid'>
          {isEditMode ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
