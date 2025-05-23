import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service'
import { UserFormData } from '@/services/admin-dashboard/model'
import { Button } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Toggle from 'react-toggle'

// In feature need to get the list from API
const UserRoleList = [
  {
    value: 1,
    label: 'Admin'
  },
  {
    value: 2,
    label: 'Portfolio Manager'
  },
  {
    value: 3,
    label: 'Operations'
  },
  {
    value: 4,
    label: 'Trader'
  }
]

// In feature need to get the list from API
const UserTypeList = [
  {
    value: 'AD',
    label: 'AD'
  },
  {
    value: 'Non AD',
    label: 'Non AD'
  }
]

/**
 * Interface for UserForm props
 */
interface UserFormProps {
  setIsOpen: (isOpen: boolean) => void
  isEditMode: boolean
  user_id?: number | null
  onFormSuccess?: (isSuccess: boolean) => void
}

/**
 * User form component for creating and editing user profiles
 */
export const UserForm: React.FC<UserFormProps> = ({
  setIsOpen,
  isEditMode = false,
  user_id,
  onFormSuccess = () => {}
}) => {
  const [loading, setLoading] = useState(false);
  const defaultValues: UserFormData = {
    user_id: null,
    first_name: '',
    last_name: '',
    role_name: '',
    role_id: null,
    user_type: '',
    email: '',
    is_active: false,
    is_super_admin: false
  }

  const onSubmit = async (data: UserFormData) => {
    isEditMode ? await handleEditUser(data) : await handleCreateUser(data)
  }

  const handleEditUser = async (data: UserFormData) => {
    try {
      const response = await adminDashboardDataService.updateUser(data)
      toast.success(response.message)
      onFormSuccess(true)
    } catch {
      toast.error('Error updating user')
      onFormSuccess(false)
    } finally {
      setIsOpen(false)
    }
  }

  const handleCreateUser = async (data: UserFormData) => {
    try {
      const response = await adminDashboardDataService.createUser(data)
      toast.success(response.message)
      onFormSuccess(true)
    } catch {
      toast.error('Error Add user')
      onFormSuccess(false)
    } finally {
      setIsOpen(false)
    }
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UserFormData>({ defaultValues })

  useEffect(() => {
    if (isEditMode && user_id) {
      setLoading(true);
      const fetchUser = async () => {
        try {
          const response = await adminDashboardDataService.getUser(user_id)
          reset(response.response_data)
        } catch {
          console.error('Error fetching user data')
        }finally{
          setLoading(false);
        }
      }
      fetchUser()
    } else {
      // Reset form to default values when in create mode
      reset(defaultValues)
    }
  }, [isEditMode, user_id, reset])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-white">Loading user details...</span>
      </div>
    )
  }


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 w-full bg-gray-900 rounded-lg'
    >
      <div className='relative flex'>
        <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400'>
          <i className='fa-regular fa-user'></i>
        </div>
        <input
          {...register('first_name', { required: 'First name is required' })}
          placeholder='First Name'
          className='w-full py-3 px-10 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
        />
      </div>
      {errors.first_name && (
        <span className='text-red-400 text-sm'>
          {errors.first_name.message}
        </span>
      )}

      <div className='relative flex'>
        <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400'>
          <i className='fa-regular fa-user'></i>
        </div>
        <input
          {...register('last_name')}
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
            disabled: isEditMode,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type='email'
          placeholder='Admin@hurricanecap.com'
          className={`w-full py-3 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 overflow-hidden text-ellipsis ${
            isEditMode && 'opacity-60'
          }`}
        />
      </div>
      {errors.email && (
        <span className='text-red-400 text-sm pt-2 pl-1'>
          {errors.email.message}
        </span>
      )}

      <div className='relative'>
        <select
          {...register('role_id', { required: 'Role is required' })}
          className='w-full py-3 px-4 bg-gray-800 border border-gray-700 rounded-md text-white appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
        >
          <option value='' disabled>
            Select Role
          </option>
          {UserRoleList.map(role => (
            <option value={role.value}>{role.label}</option>
          ))}
        </select>
        <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
          <i className='fa-solid fa-chevron-down'></i>
        </div>
      </div>
      {errors.role_id && (
        <span className='text-red-400 text-sm'>{errors.role_id.message}</span>
      )}

      <div className='relative'>
        <select
          {...register('user_type', {
            required: 'User type is required',
            disabled: isEditMode
          })}
          className='w-full py-3 px-4 bg-gray-800 border border-gray-700 rounded-md text-white appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
        >
          <option value='' disabled>
            User Type
          </option>
          {UserTypeList.map(role => (
            <option value={role.value}>{role.label}</option>
          ))}
        </select>
        <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
          <i className='fa-solid fa-chevron-down'></i>
        </div>
      </div>
      {errors.user_type && (
        <span className='text-red-400 text-sm'>{errors.user_type.message}</span>
      )}

      <div className='grid grid-cols-2 gap-2'>
        <div className='mt-4'>
          <p className='text-white mb-2'>Status</p>
          <span className='flex align-middle gap-2'>
            Inactive
            <Controller
              name='is_active'
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
