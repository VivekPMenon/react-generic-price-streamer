'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button, Checkbox, Spinner } from '@radix-ui/themes'
import { CollapseContainer } from '@/components/shared/ta-collapse/ta-collapse'
import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service'
import { SharedDropdown } from '@/components/shared'
import { DropdownOption } from '@/components/shared/ta-select/ta-select'
import { IUpdateRoleConfigReq } from '@/services/admin-dashboard/model'

interface Role {
  role_id: number
  role_name: string
  created_on: string
}

interface IScreenList {
  id: number
  screen_label: string
  description: string
  is_assigned: boolean
}

interface IPnLList {
  id: number
  label: string
  is_assigned: boolean
}

interface IScreensAndPnLData {
  screens: IScreenList[]
  'P&L': IPnLList[]
}

const Roles = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [screens, setScreens] = useState<IScreenList[]>([])
  const [pnLList, setPnLList] = useState<IPnLList[]>([])
  const [isRolesLoading, setIsRolesLoading] = useState<boolean>(true)
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  useEffect(() => {
    fetchRoleConfig()
  }, [selectedRole])

  const fetchRoleConfig = async () => {
    setLoading(true)
    try {
      if (!selectedRole?.role_id) {
        return
      }
      // Call your API service with pagination parameters
      const response = await adminDashboardDataService.getProjectsRolesConfig(
        selectedRole?.role_id
      )
      const data = response.data as IScreensAndPnLData
      setScreens(data.screens || [])
      setPnLList(data['P&L'] || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      // Handle error state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    setIsRolesLoading(true)
    try {
      // Call your API service with pagination parameters
      const response = await adminDashboardDataService.getRolesList(1, 10, true)

      // Update users and pagination data from the response
      setRoles(response.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      // Handle error state
    } finally {
      setIsRolesLoading(false)
    }
  }

  // Convert users to dropdown options format
  const rolesOptions = useCallback(() => {
    return Array.isArray(roles)
      ? roles.map(user => ({
          value: user.role_id,
          label: user.role_name,
          data: user
        }))
      : []
  }, [roles])

  // Find the currently selected option
  const selectedOption = useCallback(() => {
    if (!selectedRole) return null

    return {
      value: selectedRole.role_id,
      label: selectedRole.role_name,
      data: selectedRole
    }
  }, [selectedRole])

  const handleSelectChange = useCallback(
    (selected: DropdownOption<Role> | null) => {
      try {
        if (selected) {
          setSelectedRole(selected.data)
        } else {
          setSelectedRole(null)
          setPnLList([])
          setScreens([])
        }
      } catch (err) {
        console.error('Error changing preview user:', err)
      }
    },
    []
  )

  const handleUpdate = async () => {
    setLoading(true)
    try {
      if (!selectedRole?.role_id) {
        return
      }
      const screenIds = screens
        ?.filter(screen => screen.is_assigned)
        .map(item => item.id)
      const pnlLables = pnLList
        ?.filter(pnl => pnl.is_assigned)
        .map(item => item.label)

      const req: IUpdateRoleConfigReq = {
        role_id: selectedRole?.role_id,
        screens: screenIds,
        pms_data: pnlLables
      }
      const response = await adminDashboardDataService.updateProjectRoleConfig(
        req
      )
      console.log('User config updated successfully:', response)
      setScreens([])
      setPnLList([])
      fetchRoleConfig()
    } catch (error) {
      console.log('Update failed :', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <SharedDropdown
          options={rolesOptions()}
          value={selectedOption()}
          onChange={handleSelectChange}
          isLoading={isRolesLoading}
          placeholder='Select a Role'
          noOptionsMessage={() => 'No Roles available'}
          className='text-base max-md:w-2/4 md:w-1/3'
          isSearchable={true}
          darkMode={true}
        />
      </div>
      <div className='space-y-2 relative'>
        <CollapseContainer
          title={
            <div className='flex items-center'>
              <Checkbox
                checked={screens.every(screen => screen.is_assigned)}
                onCheckedChange={checked =>
                  setScreens(
                    screens.map(s => ({ ...s, is_assigned: !!checked }))
                  )
                }
                className='mr-3'
              />
              <span>Screens</span>
            </div>
          }
        >
          <section className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
            {screens.map((item, ind) => (
              <div
                key={ind}
                className='flex items-center bg-[#1F2937] p-4 rounded-sm'
              >
                <Checkbox
                  checked={item.is_assigned}
                  onCheckedChange={checked =>
                    setScreens(
                      screens.map((s, i) =>
                        i === ind ? { ...s, is_assigned: !!checked } : s
                      )
                    )
                  }
                  className='mr-3'
                />
                <span className='truncate'>{item.screen_label}</span>
              </div>
            ))}
          </section>
        </CollapseContainer>
        <br></br>
        <CollapseContainer
          title={
            <div className='flex items-center'>
              <Checkbox
                checked={pnLList.every(screen => screen.is_assigned)}
                onCheckedChange={checked =>
                  setPnLList(
                    pnLList.map(s => ({ ...s, is_assigned: !!checked }))
                  )
                }
                className='mr-3'
              />
              <span>P&L</span>
            </div>
          }
        >
          <section className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
            {pnLList.map((item, ind) => (
              <div
                key={ind}
                className='flex items-center bg-[#1F2937] p-4 rounded-sm'
              >
                <Checkbox
                  checked={item.is_assigned}
                  onCheckedChange={checked =>
                    setPnLList(
                      pnLList.map((s, i) =>
                        i === ind ? { ...s, is_assigned: !!checked } : s
                      )
                    )
                  }
                  className='mr-3'
                />
                <span className='truncate'>{item.label}</span>
              </div>
            ))}
          </section>
        </CollapseContainer>
        {loading && (
          <div className='absolute top-0 w-full h-full flex items-center justify-center'>
            <div className='relative bg-gray-500 opacity-50 rounded-lg w-full h-full'></div>
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
          disabled={screens.length == 0 && pnLList.length == 0}
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

export default Roles
