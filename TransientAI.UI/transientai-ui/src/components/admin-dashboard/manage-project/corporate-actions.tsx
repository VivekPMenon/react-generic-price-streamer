import { CollapseContainer } from '@/components/shared/ta-collapse/ta-collapse'
import { Button, Checkbox, Spinner, TextArea } from '@radix-ui/themes'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { SharedDropdown } from '@/components/shared'
import { DropdownOption } from '@/components/shared/ta-select/ta-select'
import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service'
import { toast } from 'react-toastify'
import { IUpdateCorpActionsConfig } from '@/services/admin-dashboard/model'

export interface User {
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

export interface IAssignedUserList {
  user_id: number
  name: string
  email: string
  is_selected?: boolean
}

export interface AccountList {
  account_number: string
}

enum ScreenDataType {
  AssignedUsers = 'Assigned Users'
}

interface CorporateActionsUsersProps {
  users: User[]
  accountList: AccountList[]
  isUserLoading: boolean
  isAccountsLoading: boolean
}

const CorporateActionsUsers = ({
  users,
  accountList,
  isUserLoading,
  isAccountsLoading
}: CorporateActionsUsersProps) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<AccountList | null>(
    null
  )
  const [assignedUserList, setAssignedUserList] = useState<IAssignedUserList[]>(
    []
  )
  const [userTags, setUserTags] = useState<User[]>([])
  const assignedUserListRef = useRef(assignedUserList)

  useEffect(() => {
    fetchAssignedUserConfig()
  }, [selectedAccount])

    
  useEffect(() => {
    assignedUserListRef.current = assignedUserList
  }, [assignedUserList])

  const fetchAssignedUserConfig = async () => {
    setLoading(true)
    try {
      if (!selectedAccount?.account_number) {
        return
      }
      // Call your API service with pagination parameters
      const response =
        await adminDashboardDataService.getCorpActionAssignedUsers(
          selectedAccount.account_number
        )
      const data = response.data as IAssignedUserList[]
      // Add is_selected property to corporate_actions
      const assignedUserWithSelection =
        data?.map(action => ({
          ...action,
          is_selected: false // Default value is false
        })) || []

      setAssignedUserList(assignedUserWithSelection)
    } catch (error) {
      console.error('Error fetching assigned users:', error)
      // Handle error state
    } finally {
      setLoading(false)
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

  // Convert users to dropdown options format
  const accountListOptions = useCallback(() => {
    return Array.isArray(accountList)
      ? accountList.map(acc => ({
          value: acc.account_number,
          label: acc.account_number,
          data: acc
        }))
      : []
  }, [accountList])

  const handleDeleteAssignedUser = async () => {
    // Check if a user is selected
    if (!selectedAccount?.account_number) {
      return
    }

    // Check if any items are selected for deletion
    const itemsToDelete = assignedUserList.filter(a => a.is_selected)
    if (itemsToDelete.length === 0) {
      return
    }

    // Optional: Show loading state
    setLoading(true)

    try {
      // Extract IDs of items to be deleted
      const deletedItemIds = itemsToDelete.map(item => item.user_id)

      // Call API to delete items
      const req: IUpdateCorpActionsConfig = {
        account_number: selectedAccount.account_number,
        userid_list: deletedItemIds
      }
      const response = await adminDashboardDataService.deleteAssignedUsers(req)

      // Update local state with remaining items
      const remainingItems = assignedUserList.filter(a => !a.is_selected)
      setAssignedUserList(remainingItems)
      toast.success(response.message || 'Items deleted successfully')
    } catch (error) {
      // More detailed error handlin
      console.error('Error deleting assigned users:', error)
      toast.error('Item deletion failed')
      await fetchAssignedUserConfig()
    } finally {
      // Reset loading state
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      if (!selectedAccount?.account_number) {
        return
      }
      const req: IUpdateCorpActionsConfig = {
        account_number: selectedAccount?.account_number,
        userid_list: userTags?.map(aUser => aUser.user_id)
      }
      const response =
        await adminDashboardDataService.updateProjectCorpActionsConfig(req)
      toast.success(response.message || 'Update successfully')
      fetchAssignedUserConfig()
      setUserTags([])
    } catch (error) {
      console.log('Update failed :', error)
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }


  const handleSetUserTags = (value: User, type: ScreenDataType) => {
    if (!value.user_id) return

    // Use the ref to get the latest state
    const existsInAssignedList = assignedUserListRef.current.some(
      user => user.user_id === value.user_id
    )

    if (existsInAssignedList) {
      toast.error('Already assigned')
      return
    }

    setUserTags(prev => {
      const currentTags = prev || []
      const existsInTags = currentTags.some(
        user => user.user_id === value.user_id
      )
      return existsInTags ? currentTags : [...currentTags, value]
    })
  }

  const handleUserSelectChange = useCallback(
    (selected: DropdownOption<User> | null) => {
      try {
        if (selected) {
          //   setSelectedUser(selected.data)
          handleSetUserTags(selected.data, ScreenDataType.AssignedUsers)
        } else {
          setSelectedUser(null)
        }
      } catch (err) {
        console.error('Error changing preview user:', err)
      }
    },
    []
  )

  const handleSelectAccountChange = useCallback(
    (selected: DropdownOption<AccountList> | null) => {
      try {
        if (selected) {
          setSelectedAccount(selected.data)
        } else {
          setSelectedAccount(null)
          setAssignedUserList([]);
          setUserTags([]);
        }
      } catch (err) {
        console.error('Error changing account number:', err)
      }
    },
    []
  )

  // Find the currently selected option
  const selectedUserOption = useCallback(() => {
    if (!selectedUser) return null

    return {
      value: selectedUser.user_id,
      label: selectedUser.full_name,
      data: selectedUser
    }
  }, [selectedUser])

  // Find the currently selected option
  const selectedAccountOption = useCallback(() => {
    if (!selectedAccount) return null

    return {
      value: selectedAccount.account_number,
      label: selectedAccount.account_number,
      data: selectedAccount
    }
  }, [selectedAccount])

  return (
    <>
      <div>
        <SharedDropdown
          options={accountListOptions()}
          value={selectedAccountOption()}
          onChange={handleSelectAccountChange}
          isLoading={isAccountsLoading}
          placeholder='Select a Account'
          noOptionsMessage={() => 'No Account available'}
          className='text-base max-md:w-2/4 md:w-1/3'
          isSearchable={true}
          darkMode={true}
        />
      </div>
      <div className='space-y-2 relative'>
        <CollapseContainer title={<span>Assigned User</span>}>
          <div className='flex gap-8 mt-3 lg:flex-row flex-col'>
            <section className='lg:w-1/2 rounded-md'>
              <div className='flex items-center justify-between p-4 bg-gray-800'>
                <div className='flex items-center'>
                  <Checkbox
                    checked={assignedUserList.every(a => a.is_selected)}
                    onCheckedChange={checked => {
                      setAssignedUserList(
                        assignedUserList.map(a => ({
                          ...a,
                          is_selected: !!checked
                        }))
                      )
                    }}
                    className='mr-3'
                  />
                  <span className='font-medium text-sm'>All Users</span>
                </div>
                {assignedUserList.some(a => a.is_selected) && (
                  <button
                    type='button'
                    aria-label='Delete icon'
                    className='text-red-500 cursor-pointer'
                    onClick={handleDeleteAssignedUser}
                  >
                    <i className='fa-solid fa-trash'></i>
                  </button>
                )}
              </div>

              {/* Account List */}
              <div className='scrollable-div max-h-52'>
                {assignedUserList.map((account, ind) => (
                  <div
                    key={account.user_id}
                    className='flex items-center p-4 border border-[#353b49]'
                  >
                    <Checkbox
                      checked={account.is_selected}
                      onCheckedChange={checked => {
                        setAssignedUserList(
                          assignedUserList.map((a, i) =>
                            i === ind ? { ...a, is_selected: !!checked } : a
                          )
                        )
                      }}
                      className='mr-3'
                    />
                    <span>{account.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className='lg:w-1/2'>
              <div>
                <SharedDropdown
                  isDisabled={!selectedAccount?.account_number}
                  options={userOptions()}
                  value={selectedUserOption()}
                  onChange={handleUserSelectChange}
                  isLoading={isUserLoading}
                  placeholder='Select a user'
                  noOptionsMessage={() => 'No users available'}
                  className='text-base max-md:w-full md:w-full'
                  isSearchable={true}
                  darkMode={true}
                />
              </div>
              <div className='flex flex-wrap gap-2 mt-2 border border-[#353b49] rounded-md p-4 min-h-32'>
                {userTags?.map((tag, index) => (
                  <div
                    key={index}
                    className='py-1 px-2 h-max text-sm rounded-md flex items-center bg-gray-800 border border-white/10 hover:bg-gray-700 transition-all'
                  >
                    {tag.full_name}
                    <button
                      type='button'
                      className='ml-2 cursor-pointer hover:text-gray-500'
                      onClick={() =>
                        setUserTags(userTags.filter(t => t !== tag))
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

        {loading && (
          <div className='absolute top-0 w-full h-full flex items-center justify-center'>
            <div className='relative bg-gray-500 opacity-50 rounded-lg w-full h-full z-[100]'></div>
            <span className='opacity-100 absolute'>
              <Spinner />
            </span>
          </div>
        )}
      </div>
      <div className='flex w-full justify-end items-center gap-2'>
        <Button className='w-[150px]' size={'3'} color='gray' variant='solid'>
          Cancel
        </Button>

        <Button
          disabled={userTags.length == 0 || !selectedAccount?.account_number}
          className='w-[150px]'
          loading={loading}
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

export default CorporateActionsUsers
