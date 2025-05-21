import { CollapseContainer } from '@/components/shared/ta-collapse/ta-collapse'
import { Button, Checkbox, TextArea } from '@radix-ui/themes'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { SharedDropdown } from '@/components/shared'
import { DropdownOption } from '@/components/shared/ta-select/ta-select'
import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service'

interface User {
  user_id: number
  full_name: string
  first_name: string
  last_name: string
  role_id: string
  role_name: string
  is_super_admin: boolean
  user_type: string
  email: string
  is_active: boolean
}
interface ICorporateAction {
  id: number
  corp_label: string
  is_selected?: boolean
}

interface IMargin {
  id: number
  margin_label: string
  is_selected?: boolean
}

interface IUserConfigData {
  corporate_actions: ICorporateAction[]
  margin: IMargin[]
}
enum ScreenDataType {
  AC_Number = 'AC Number',
  Margin_Cols = 'Margin Cols'
}

const Users = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [accountNumbers, setAccountNumbers] = useState<ICorporateAction[]>([])
  const [marginCols, setMarginCols] = useState<IMargin[]>([])
  const [accountTags, setAccountTags] = useState<string[]>([])
  const [marginTags, setMarginTags] = useState<string[]>([])

  // Refs for text areas
  const accountTextAreaRef = useRef<HTMLTextAreaElement>(null)
  const marginTextAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetchUserConfig()
  }, [selectedUser])

  const fetchUserConfig = async () => {
    setLoading(true)
    try {
      if (!selectedUser?.user_id) {
        return
      }
      // Call your API service with pagination parameters
      const response = await adminDashboardDataService.getProjectsUsersConfig(
        selectedUser?.user_id
      )
      const data = response.data as IUserConfigData
      // Add is_selected property to corporate_actions
      const corporateActionsWithSelection =
        data?.corporate_actions?.map(action => ({
          ...action,
          is_selected: false // Default value is false
        })) || []

      // Add is_selected property to margin
      const marginWithSelection =
        data?.margin?.map(margin => ({
          ...margin,
          is_selected: false // Default value is false
        })) || []

      setAccountNumbers(corporateActionsWithSelection)
      setMarginCols(marginWithSelection)
    } catch (error) {
      console.error('Error fetching users:', error)
      // Handle error state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  const fetchUsers = async () => {
    setIsUserLoading(true)
    try {
      // Call your API service with pagination parameters
      const response = await adminDashboardDataService.getUserList(1, 10, true)

      // Update users and pagination data from the response
      setUsers(response.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      // Handle error state
    } finally {
      setIsUserLoading(false)
    }
  }

  // Convert users to dropdown options format
  const userOptions = useCallback(() => {
    return Array.isArray(users)
      ? users.map(user => ({
          value: user.user_id,
          label: user.full_name,
          data: user
        }))
      : []
  }, [users])

 const handleDelete = async () => {
  // Check if a user is selected
  if (!selectedUser?.user_id) {
    return;
  }

  // Check if any items are selected for deletion
  const itemsToDelete = accountNumbers.filter(a => a.is_selected);
  if (itemsToDelete.length === 0) {
    return;
  }

  // Optional: Show loading state
  setLoading(true);

  try {
    // Extract IDs of items to be deleted
    const deletedItemIds = itemsToDelete.map(item => item.id);
    
    // Call API to delete items
    const response = await adminDashboardDataService.deleteCorpActions(
      selectedUser.user_id,
      deletedItemIds
    );
    
    // Update local state with remaining items
    const remainingItems = accountNumbers.filter(a => !a.is_selected);
    setAccountNumbers(remainingItems);

    console.log('Items deleted successfully:', response);
  } catch (error) {
    // More detailed error handlin
    console.error('Error deleting corporate actions:', error);
    await fetchUserConfig();
  } finally {
    // Reset loading state
    setLoading(false);
  }
}

  const handleDeleteMargin = () => {
    setMarginCols(marginCols.filter(a => !a.is_selected))
  }

  const handleUpdate = async () => {}

  const processTagInput = (value: string, type: ScreenDataType) => {
    if (value.trim() !== '') {
      const newTags = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')

      if (newTags.length > 0) {
        if (type === ScreenDataType.AC_Number) {
          setAccountTags(prev => [...prev, ...newTags])
          if (accountTextAreaRef.current) {
            accountTextAreaRef.current.value = ''
          }
        } else if (type === ScreenDataType.Margin_Cols) {
          setMarginTags(prev => [...prev, ...newTags])
          if (marginTextAreaRef.current) {
            marginTextAreaRef.current.value = ''
          }
        }
      }
    }
  }

  const handleTagChange = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    type: ScreenDataType
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      processTagInput(e.currentTarget.value, type)
    }
  }

  const handleAddButtonClick = (type: ScreenDataType) => {
    const textAreaRef =
      type === ScreenDataType.AC_Number ? accountTextAreaRef : marginTextAreaRef
    if (textAreaRef.current) {
      processTagInput(textAreaRef.current.value, type)
    }
  }

  const handleSelectChange = useCallback(
    (selected: DropdownOption<User> | null) => {
      try {
        if (selected) {
          setSelectedUser(selected.data)
        } else {
        }
      } catch (err) {
        console.error('Error changing preview user:', err)
      }
    },
    []
  )

  // Find the currently selected option
  const selectedOption = useCallback(() => {
    if (!selectedUser) return null

    return {
      value: selectedUser.user_id,
      label: selectedUser.full_name,
      data: selectedUser
    }
  }, [selectedUser])

  return (
    <>
      <div>
        <SharedDropdown
          options={userOptions()}
          value={selectedOption()}
          onChange={handleSelectChange}
          isLoading={isUserLoading}
          placeholder='Select a user'
          noOptionsMessage={() => 'No users available'}
          className='text-base max-md:w-2/4 md:w-1/3'
          isSearchable={true}
          darkMode={true}
        />
      </div>
      <CollapseContainer title={<span>Corporate Action</span>}>
        <div className='flex gap-8 mt-3 lg:flex-row flex-col'>
          <section className='lg:w-1/2 rounded-md'>
            <div className='flex items-center justify-between p-4 bg-gray-800'>
              <div className='flex items-center'>
                <Checkbox
                  checked={accountNumbers.every(a => a.is_selected)}
                  onCheckedChange={checked => {
                    setAccountNumbers(
                      accountNumbers.map(a => ({
                        ...a,
                        is_selected: !!checked
                      }))
                    )
                  }}
                  className='mr-3'
                />
                <span className='font-medium text-sm'>Account Numbers</span>
              </div>
              {accountNumbers.some(a => a.is_selected) && (
                <button
                  type='button'
                  aria-label='Delete icon'
                  className='text-red-500 cursor-pointer'
                  onClick={handleDelete}
                >
                  <i className='fa-solid fa-trash'></i>
                </button>
              )}
            </div>

            {/* Account List */}
            <div className='scrollable-div max-h-52'>
              {accountNumbers.map((account, ind) => (
                <div
                  key={account.id}
                  className='flex items-center p-4 border border-[#353b49]'
                >
                  <Checkbox
                    checked={account.is_selected}
                    onCheckedChange={checked => {
                      setAccountNumbers(
                        accountNumbers.map((a, i) =>
                          i === ind ? { ...a, is_selected: !!checked } : a
                        )
                      )
                    }}
                    className='mr-3'
                  />
                  <span>{account.corp_label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className='border border-[#353b49] rounded-sm p-4 lg:w-1/2'>
            <div className='mb-2 relative'>
              <TextArea
                ref={accountTextAreaRef}
                className='bg-transparent w-full pr-10'
                placeholder='Type and enter or give values in comma separated'
                onKeyDown={e => handleTagChange(e, ScreenDataType.AC_Number)}
              />
              <button
                type='button'
                onClick={() => handleAddButtonClick(ScreenDataType.AC_Number)}
                className='absolute w-7 h-7 flex top-2 right-2 justify-center items-center text-md rounded-full hover:bg-gray-700 text-teal-400'
                title='Add tags'
              >
                <i className='fa-light fa-plus'></i>
              </button>
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {accountTags.map((tag, index) => (
                <div
                  key={index}
                  className='py-1 px-2 text-sm rounded-md flex items-center bg-gray-800 border border-white/10 hover:bg-gray-700 transition-all'
                >
                  {tag}
                  <button
                    type='button'
                    className='ml-2 cursor-pointer hover:text-gray-500'
                    onClick={() =>
                      setAccountTags(accountTags.filter(t => t !== tag))
                    }
                    aria-label='close'
                  >
                    <i className='fa-solid fa-xmark'></i>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </CollapseContainer>
      <br></br>
      <CollapseContainer title={<span>Margin</span>}>
        <div className='flex gap-8 mt-3 lg:flex-row flex-col'>
          <section className='lg:w-1/2 rounded-md'>
            <div className='flex items-center justify-between p-4 bg-gray-800'>
              <div className='flex items-center'>
                <Checkbox
                  checked={marginCols.every(a => a.is_selected)}
                  onCheckedChange={checked => {
                    setMarginCols(
                      marginCols.map(a => ({ ...a, is_selected: !!checked }))
                    )
                  }}
                  className='mr-3'
                />
                <span className='font-medium text-sm'>Values</span>
              </div>
              {marginCols.some(a => a.is_selected) && (
                <button
                  type='button'
                  aria-label='Delete icon'
                  className='text-red-500 cursor-pointer'
                  onClick={handleDeleteMargin}
                >
                  <i className='fa-solid fa-trash'></i>
                </button>
              )}
            </div>

            {/* Account List */}
            <div className='scrollable-div max-h-52'>
              {marginCols.map((account, ind) => (
                <div
                  key={account.id}
                  className='flex items-center p-4 border border-[#353b49]'
                >
                  <Checkbox
                    checked={account.is_selected}
                    onCheckedChange={checked => {
                      setMarginCols(
                        marginCols.map((a, i) =>
                          i === ind ? { ...a, is_selected: !!checked } : a
                        )
                      )
                    }}
                    className='mr-3'
                  />
                  <span>{account.margin_label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className='border border-[#353b49] rounded-sm p-4 lg:w-1/2'>
            <div className='mb-2 relative'>
              <TextArea
                ref={marginTextAreaRef}
                className='bg-transparent w-full pr-10'
                placeholder='Type and enter or give values in comma separated'
                onKeyDown={e => handleTagChange(e, ScreenDataType.Margin_Cols)}
              />
              <button
                type='button'
                onClick={() => handleAddButtonClick(ScreenDataType.Margin_Cols)}
                className='absolute w-7 h-7 flex top-2 right-2 justify-center items-center text-md rounded-full hover:bg-gray-700 text-teal-400'
                title='Add tags'
              >
                <i className='fa-light fa-plus'></i>
              </button>
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {marginTags.map((tag, index) => (
                <div
                  key={index}
                  className='py-1 px-2 text-sm rounded-md flex items-center bg-gray-800 border border-white/10 hover:bg-gray-700 transition-all'
                >
                  {tag}
                  <button
                    type='button'
                    className='ml-2 cursor-pointer hover:text-gray-500'
                    onClick={() =>
                      setMarginTags(marginTags.filter(t => t !== tag))
                    }
                    aria-label='close'
                  >
                    <i className='fa-solid fa-xmark'></i>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </CollapseContainer>
      <div className='flex w-full justify-end items-center gap-2'>
        <Button className='w-[150px]' size={'3'} color='gray' variant='solid'>
          Cancel
        </Button>

        <Button
          className='w-[150px]'
          onClick={() => handleUpdate()}
          type='submit'
          size={'3'}
          color='teal'
          variant='solid'
        >
          Save
        </Button>
      </div>
    </>
  )
}

export default Users
