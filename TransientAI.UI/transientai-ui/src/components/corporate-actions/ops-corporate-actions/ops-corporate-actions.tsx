'use client'

import styles from './ops.module.scss'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CorporateAction,
  useCorpActionsStore
} from '@/services/corporate-actions'
import EmailViewer from '../../email-parser/email-viewer'
import { useScrollTo } from '@/lib/hooks'
import { RoleType, useUserContextStore } from '@/services/user-context'
import { DataGrid, getCurrencyColDefTemplate } from '../../data-grid'
import { ColDef, GridApi, RowClickedEvent } from 'ag-grid-community'
import { corpActionsDataService } from '@/services/corporate-actions/corporate-actions-data'
import opsData from './ops_view_output.json'
import { Accordion } from '@/components/accordion/accordion'
import { OpsList } from './ops-list'

interface SortedData {
  acquired: any[];
  no_action_acquired: any[];
  expired: any[];
}

export function OpsCorporateActions () {
  const { userContext } = useUserContextStore()
  const {
    corpActions,
    selectedCorpAction,
    setSelectedCorpAction,
    searchCorpActions
  } = useCorpActionsStore()
  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>()
  const gridApiRef = useRef<GridApi | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedEmailContent, setSelectedEmailContent] = useState<string>('')
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false)
  const [isCompactViewEnabled, setIsCompactViewEnabled] = useState(false)

  const colDefs = useMemo(() => getColumnDefs(), [])

  useEffect(() => {
    async function calculateSelectedEmailContent () {
      if (!selectedCorpAction?.eventId) {
        return
      }

      const newContent = await corpActionsDataService.getCorpActionEmail(
        selectedCorpAction.eventId,
        selectedCorpAction.version!
      )
      setSelectedEmailContent(newContent)

      gridApiRef?.current?.forEachNode(node =>
        node.setSelected(
          node.data && node.data?.eventId === selectedCorpAction?.eventId
        )
      )

      const selectedIndex = corpActions.findIndex(
        corpAction => selectedCorpAction?.eventId === corpAction.eventId
      )
      // virtualizer.scrollToIndex(selectedIndex)
    }

    calculateSelectedEmailContent()
  }, [corpActions, selectedCorpAction])

  // function onSearchQueryChange (event: any) {
  //   setSearchQuery(event.target.value)
  // }

  // async function onKeyDown (event: any) {
  //   if (event.key !== 'Enter') {
  //     return
  //   }

  //   searchCorpActions(searchQuery)
  // }

  function onSelectEmail (
    corpAction: CorporateAction,
    version: number | undefined
  ) {
    setIsLoadingEmail(true)
    setSelectedEmailContent('')
    setSelectedCorpAction(corpAction)

    if (!corpAction.eventId || version === undefined) {
      setIsLoadingEmail(false)
      return
    }

    corpActionsDataService
      .getCorpActionEmail(corpAction.eventId, version)
      .then(content => {
        setSelectedEmailContent(content)
        scrollToTarget()
      })
      .finally(() => setIsLoadingEmail(false))
  }

  function onRowClicked (event: RowClickedEvent) {
    onSelectEmail(event.data, event.data.version)
  }

  function getColumnDefs (): ColDef[] {
    return [
      {
        field: 'eventId',
        headerName: 'Announcement ID',
        width: 170,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'security.identifiers.ticker',
        headerName: 'Ticker',
        width: 90,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'security.identifiers.isin',
        headerName: 'ISIN',
        width: 170,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'security.name',
        headerName: 'Security Name',
        width: 300,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'eventType',
        headerName: 'Event Type',
        width: 170,
        filter: 'agSetColumnFilter'
      },
      // {
      //   field: 'eventDescription',
      //   headerName: 'Event Description',
      //   width: 300,
      //   wrapText: true,
      //   autoHeight: true,
      //   filter: 'agSetColumnFilter'
      // },
      {
        field: 'eventStatus',
        headerName: 'Status',
        width: 130,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'holdingQuantity',
        headerName: 'Holding',
        width: 130,
        ...getCurrencyColDefTemplate()
      },
      {
        field: 'keyDates',
        headerName: 'Key Dates',
        width: 250
        // filter: 'agDateColumnFilter'
      },
      // {
      //   field: 'eventDate',
      //   headerName: 'Event Date',
      //   width: 170,
      //   sort: 'desc',
      //   filter: 'agDateColumnFilter'
      // },
      {
        field: 'version',
        headerName: 'Version',
        width: 100,
        filter: 'agNumberColumnFilter'
      }
    ]
  }

  const today = new Date().toISOString().split('T')[0];
  const sortedData: SortedData = opsData.data.reduce(
    (acc: SortedData, item) => {
      const payDate = item.dates.pay_date.split("T")[0];
      if (payDate < today) {
        acc.expired.push(item);
      } else if(item.requirements.action_required) {
        acc.acquired.push(item);
      } else {
        acc.no_action_acquired.push(item)
      }

      return acc;
    },
    { acquired: [], no_action_acquired: [], expired: [] }
  )
console.log(sortedData)
  const items = [
    {
      value: 'item-1',
      title: 'Action Required',
      titleTextStyle: 'text-red-500',
      content: (
        <OpsList data={sortedData.acquired}/> 
        
      )
    },
    {
      value: 'item-2',
      title: 'No Action Required',
      titleTextStyle: 'text-green-500',
      content: (
        <OpsList data={sortedData.no_action_acquired}/> 
      )
    },
    {
      value: 'item-3',
      title: 'Expired',
      titleTextStyle: 'text-gray-500',
      content: (
        <OpsList data={sortedData.expired}/> 
      )
    }
  ]

  const corpActionsListElement = isCompactViewEnabled ? (
    <DataGrid
      ref={gridApiRef}
      className='p-2'
      columnDefs={colDefs}
      rowData={corpActions}
      isSummaryGrid={true}
      onRowClicked={onRowClicked}
      rowSelection={'single'}
    ></DataGrid>
  ) : <Accordion type='multiple' items={items}/>

  return (
    <>
      <div className={styles['corporate-actions']}>
        <div className={styles['chatbot']}>
          {corpActions?.length ? corpActionsListElement : <></>}
        </div>
      </div>
    </>
  )
}
