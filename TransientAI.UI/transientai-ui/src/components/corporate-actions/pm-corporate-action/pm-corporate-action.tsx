'use client'

import { Accordion } from '@/components/accordion/accordion';
import { PmList } from './pm-list';
import { CorporateAction, useCorpActionsStore } from '@/services/corporate-actions';
import { useEffect } from 'react';
import { useFilterPmCorporateActions } from './use-filter-pm-corp-action';

type CorporateActionKey = 'Action Required' | 'No Action Required' | 'Expired';

export function PmCorporateActions() {
  const { 
    sortByAction, 
    pmCorpActions, 
    filterActions,
    loadPmCorpActions 
  } = useCorpActionsStore();
  
  useEffect(() => {
    loadPmCorpActions();
  }, []);
  
  const sortedData = useFilterPmCorporateActions(pmCorpActions, filterActions, sortByAction);

  const getCorporateActions = (key: CorporateActionKey): CorporateAction[] =>
    (sortedData[key] as CorporateAction[]) || [];

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
          data={getCorporateActions('Action Required')}
        />
      )}
    </>
  );
}
