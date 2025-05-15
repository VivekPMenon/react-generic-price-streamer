import { Button } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

/**
 * Type for form data structure
 */
export interface RoleData {
  role_id: string
  role_name: string
  created_on: string
}

/**
 * Interface for UserForm props
 */
interface UserFormProps {
  setIsOpen: (isOpen: boolean) => void
  isEditMode: boolean
  role?: RoleData | null
}

/**
 * User form component for creating and editing user profiles
 */
export const RoleForm: React.FC<UserFormProps> = ({
  setIsOpen,
  isEditMode = false,
  role
}) => {
  const defaultValues = {
    role_id: '',
    role_name: '',
    created_on: ''
  }

  const onSubmit = (data: RoleData) => {
    console.log('Form submitted:', data)
    setIsOpen(false)
  }

  const { register, handleSubmit, reset } =
    useForm<RoleData>({ defaultValues })

  useEffect(() => {
    if (isEditMode && role) {
      // Populate form with user data when in edit mode
      reset(role)
    } else {
      // Reset form to default values when in create mode
      reset(defaultValues)
    }
  }, [isEditMode, role, reset])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 w-full bg-gray-900 rounded-lg'
    >
      <div className='relative flex'>
        <input
          {...register('role_name', { required: 'First name is required' })}
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
