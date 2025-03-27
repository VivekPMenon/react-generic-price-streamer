'use client'

import { useState } from 'react'
import { Accordion } from '@/components/accordion/accordion';
import PmData from './portfolio_manager_output.json';
import { PmList } from './pm-list'
import { CorporateAction } from './models';

export function PmCorporateActions () {
  const [selectedCorpAction, setSelectedCorpAction] = useState<any>();


   const items = [
      {
        value: 'item-1',
        title: 'Action Required',
        titleTextStyle: 'text-red-500',
        content: (
          <PmList actionRequired={true} data={PmData.data['Action Required'] as CorporateAction[]}/> 
          
        )
      },
      {
        value: 'item-2',
        title: 'No Action Required',
        titleTextStyle: 'text-green-500',
        content: (
          <PmList actionRequired={false} data={PmData.data['No Action Required'] as CorporateAction[]}/> 
        )
      }
    ]

  return <Accordion type='multiple' items={items}/>
}
