import * as React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { ReactNode } from 'react'
import Roles from './roles'
import Users from './users'

interface TabItem {
  value: TabValues
  label: string
  content?: ReactNode
}

enum TabValues {
  USERS = 'users',
  ROLES = 'roles'
}

const TabList: TabItem[] = [
  {
    value: TabValues.USERS,
    label: 'Users',
    content: <Users/>
  },
  {
    value: TabValues.ROLES,
    label: 'Roles',
    content: <Roles/>
  }
]

const ManageProject = () => {
  return (
    <Tabs.Root
      className='flex w-full h-full flex-col rounded-md overflow-hidden'
      defaultValue={TabValues.USERS}
    >
      <Tabs.List className='flex max-w-min' aria-label='Manage your project'>
        {TabList.map(tab => (
          <Tabs.Trigger
            key={tab.value}
            className='flex h-12 flex-1 cursor-pointer select-none items-center justify-center px-5 text-base font-medium text-gray-200 outline-none relative hover:text-teal-400 data-[state=active]:text-teal-400 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]'
            value={tab.value}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <div className='w-full h-px bg-[#202020]' />
      {TabList.map(tab => (
        <Tabs.Content
          className='grow p-5 outline-none max-h-[calc(100vh-120px)] scrollable-div'
          value={tab.value}
        >
          <div className='space-y-4'>{tab.content}</div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export default ManageProject
