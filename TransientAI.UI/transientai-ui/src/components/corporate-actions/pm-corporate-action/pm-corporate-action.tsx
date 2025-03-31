'use client'

import { Accordion } from '@/components/accordion/accordion';
import PmData from './portfolio_manager_output.json';
import { PmList } from './pm-list';
import { CorporateAction, useCorpActionsStore } from '@/services/corporate-actions';

type CorporateActionKey = 'Action Required' | 'No Action Required' | 'Expired';

export function PmCorporateActions() {
  const { sortByAction, pmCorpActions } = useCorpActionsStore();
 
  const getCorporateActions = (key: CorporateActionKey): CorporateAction[] =>
    (PmData.data[key] as CorporateAction[]) || [];
  
  
  const items = [
    {
      value: '1',
      title: 'Action Required',
      titleTextStyle: 'text-red-500',
      content: <PmList data={getCorporateActions('Action Required')} />,
    },
    {
      value: '2',
      title: 'No Action Required',
      titleTextStyle: 'text-green-500',
      content: <PmList data={getCorporateActions('No Action Required')} />,
    },
    {
      value: '3',
      title: 'Expired',
      titleTextStyle: 'text-gray-500',
      content: <PmList data={getCorporateActions("Expired")} />,
    },
  ];

  return (
    <>
      {sortByAction ? (
        <Accordion type="multiple" items={items} />
      ) : (
        <PmList
          data={[
            ...(PmData.data['Action Required'] || []),
            ...(PmData.data['No Action Required'] || []),
            ...(PmData.data['Expired'] || []),
          ] as CorporateAction[]}
        />
      )}
    </>
  );
}
