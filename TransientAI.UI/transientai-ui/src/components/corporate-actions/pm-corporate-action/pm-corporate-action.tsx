'use client'

import { Accordion } from '@/components/accordion/accordion';
import PmData from './portfolio_manager_output.json';
import { PmList } from './pm-list'

export function PmCorporateActions () {
 

   const items = [
      {
        value: 'item-1',
        title: 'Action Required',
        titleTextStyle: 'text-red-500',
        content: (
          <PmList actionRequired={true} data={PmData.data['Action Required']}/> 
          
        )
      },
      {
        value: 'item-2',
        title: 'No Action Required',
        titleTextStyle: 'text-green-500',
        content: (
          <PmList actionRequired={false} data={PmData.data['No Action Required']}/> 
        )
      },
      {
        value: 'item-3',
        title: 'Expired',
        titleTextStyle: 'text-gray-500',
        content: (
          <PmList actionRequired={false} data={PmData.data.Expired}/> 
        )
      }
    ]

  return <Accordion type='multiple' items={items}/>
}
