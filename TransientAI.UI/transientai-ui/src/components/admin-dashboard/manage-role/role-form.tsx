import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service'
import { RoleFormData } from '@/services/admin-dashboard/model'
import { Button } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

/**
 * Interface for UserForm props
 */
interface RoleFormProps {
  setIsOpen: (isOpen: boolean) => void
  isEditMode: boolean
  onFormSuccess?: (isSuccess: boolean) => void
}

/**
 * User form component for creating and editing user profiles
 */
export const RoleForm: React.FC<RoleFormProps> = ({
  setIsOpen,
  isEditMode = false,
  onFormSuccess = () => {}
}) => {
  const defaultValues: RoleFormData = {
    role_name: ''
  }

  const onSubmit = (data: RoleFormData) => {
    handleCreateUser(data)
  }

  const handleCreateUser = async (data: RoleFormData) => {
    try {
      const response = await adminDashboardDataService.createRole(data)
      toast.success(response.message)
      onFormSuccess(true)
    } catch {
      toast.error('Error Create Role')
      onFormSuccess(false)
    } finally {
      setIsOpen(false)
    }
  }

  const { register, handleSubmit, reset } = useForm<RoleFormData>({
    defaultValues
  })

  useEffect(() => {
    if (isEditMode) {
      // Populate form with user data when in edit mode
      reset(defaultValues) //currently not available edit mode
    } else {
      // Reset form to default values when in create mode
      reset(defaultValues)
    }
  }, [isEditMode, reset])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 w-full bg-gray-900 rounded-lg'
    >
      <div className='relative flex'>
        <input
          {...register('role_name', { required: 'Role Name is required' })}
          placeholder='Enter Role Name'
          className='w-full py-3 px-10 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
        />
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
