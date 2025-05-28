import * as React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { ReactNode, useEffect, useState, useMemo } from 'react'
import Roles, { Role } from './roles'
import Users, { User } from './users'
import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service'
import CorporateActionsUsers, { AccountList } from './corporate-actions'

enum TabValues {
  USERS = 'users',
  ROLES = 'roles',
  CORPACTION = 'corporate action'
}

interface TabItem {
  value: TabValues
  label: string
  content?: ReactNode
}

const TAB_LIST: Omit<TabItem, 'content'>[] = [
  { value: TabValues.USERS, label: 'Users' },
  { value: TabValues.ROLES, label: 'Roles' },
  { value: TabValues.CORPACTION, label: 'Corporate Action' }
]

const ManageProject = () => {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [accountList, setAccountList] = useState<AccountList[]>([])
  const [loading, setLoading] = useState({
    users: false,
    roles: false,
    accountList: false
  })

  const fetchInitialData = async () => {
    try {
      setLoading(prev => ({
        ...prev,
        users: true,
        roles: true,
        accountList: true
      }))

      // Fetch users and roles in parallel with allSettled
      const [usersResult, rolesResult, accountListResult] =
        await Promise.allSettled([
          adminDashboardDataService.getUserList(1, 10, true),
          adminDashboardDataService.getRolesList(1, 10, true),
          adminDashboardDataService.getAccountList()
        ])

      // Handle each result separately
      setUsers(
        usersResult.status === 'fulfilled' ? usersResult.value.data || [] : []
      )
      setRoles(
        rolesResult.status === 'fulfilled' ? rolesResult.value.data || [] : []
      )
      setAccountList(
        accountListResult.status === 'fulfilled'
          ? accountListResult.value.data || []
          : []
      )
    } catch (error) {
      console.error('Error in fetchInitialData:', error)
    } finally {
      setLoading(prev => ({
        ...prev,
        users: false,
        roles: false,
        accountList: false
      }))
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  const tabItems = useMemo<TabItem[]>(
    () =>
      TAB_LIST.map(tab => ({
        ...tab,
        content: (() => {
          switch (tab.value) {
            case TabValues.USERS:
              return <Users isUserLoading={loading.users} users={users} />
            case TabValues.ROLES:
              return <Roles isRolesLoading={loading.roles} roles={roles} />
            case TabValues.CORPACTION:
              return (
                <CorporateActionsUsers
                  isUserLoading={loading.accountList}
                  isAccountsLoading={loading.accountList}
                  users={users}
                  accountList={accountList}
                />
              )
            default:
              return null
          }
        })()
      })),
    [users, roles, loading.users, loading.roles]
  )

  return (
    <Tabs.Root
      className='flex w-full h-full flex-col rounded-md overflow-hidden'
      defaultValue={TabValues.USERS}
    >
      <Tabs.List className='flex max-w-min' aria-label='Manage your project'>
        {tabItems.map(tab => (
          <Tabs.Trigger
            key={tab.value}
            className='flex h-12 flex-1 whitespace-nowrap cursor-pointer select-none items-center justify-center px-5 text-base font-medium text-gray-200 outline-none relative hover:text-teal-400 data-[state=active]:text-teal-400 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]'
            value={tab.value}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <div className='w-full h-px bg-[#202020]' />
      {tabItems.map(tab => (
        <Tabs.Content
          key={tab.value}
          className='grow p-5 outline-none max-h-[calc(100vh-120px)] scrollable-div'
          value={tab.value}
        >
          <div className='space-y-4 relative'>{tab.content}</div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export default ManageProject
