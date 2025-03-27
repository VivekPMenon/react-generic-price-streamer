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
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual'
import { Spinner } from '@radix-ui/themes'
import { formatDateString } from '@/lib/utility-functions/date-operations'
import Toggle from 'react-toggle'
import { CorporateActionHeader } from '../corporate-actions-header'
import opsData from './ops_view_output.json'

export function OpsCorporateActions () {
  const { userContext } = useUserContextStore()
  const {
    corpActions,
    selectedCorpAction,
    setSelectedCorpAction,
    searchCorpActions
  } = useCorpActionsStore()
  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>()
  const divRef = useRef<HTMLDivElement>(null)
  const gridApiRef = useRef<GridApi | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedEmailContent, setSelectedEmailContent] = useState<string>('')
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false)
  const [isCompactViewEnabled, setIsCompactViewEnabled] = useState(false)

  // const [emailContents, setEmailContents] = useState<any>({});
  const virtualizer = useVirtualizer({
    count: corpActions.length,
    getScrollElement: () => divRef.current,
    estimateSize: () => 200,
    overscan: 5,
    gap: 10,
    paddingStart: 2,
    paddingEnd: 5
  })

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
      virtualizer.scrollToIndex(selectedIndex)
    }

    calculateSelectedEmailContent()
  }, [corpActions, selectedCorpAction, virtualizer])

  function onSearchQueryChange (event: any) {
    setSearchQuery(event.target.value)
  }

  async function onKeyDown (event: any) {
    if (event.key !== 'Enter') {
      return
    }

    searchCorpActions(searchQuery)
  }

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

  const items = virtualizer.getVirtualItems()

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
  ) : (
    <div
      className={`${styles['corporate-actions-response']} scrollable-div`}
      ref={divRef}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {items
          .map((item: VirtualItem) => ({
            item,
            corpAction: opsData.data[item.index]
          }))
          .map(({ item, corpAction }) => (
            <div
              key={item.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${item.start}px)`
              }}
              className={`${styles['corporate-action']} ${
                selectedCorpAction?.eventId === corpAction.eventId
                  ? styles['active']
                  : ''
              }`}
              ref={virtualizer.measureElement}
              data-index={item.index}
            >
              <div
                id={corpAction.eventId}
                onClick={() => setSelectedCorpAction(corpAction)}
              >
                <div className='p-1'>
                  <div className='flex justify-between'>
                    <div className='flex items-center'>
                    <i className='fa-solid fa-microphone-lines mr-2'></i>
                      <span className='mr-2'>
                        Ticker: {corpAction.security?.identifiers?.ticker}
                      </span>
                      <span className='text-green-500'>
                        General Corp Action - Mandatory Confirmed
                      </span>
                    </div>
                    <div className='text-gray-400'>
                      Holding: {corpAction.holdingQuantity} | Version:{' '}
                      {corpAction.version} | Jan 01 20XX 00:00 ET
                    </div>
                  </div>
                  <div className='flex justify-between mt-1'>
                    <div>
                      <span>XYZ CORPORATION CMN</span>
                    </div>
                    <div className='text-right'>
                      <span className='mr-4'>ISIN: {corpAction.isin}</span>
                      <span className='mr-4'>ID: {corpAction.id}</span>
                      <span>
                        No. Accounts:{' '}
                        {corpAction.accounts?.length
                          ? corpAction.accounts.length
                          : ''}
                      </span>
                      <span className='ml-4'>
                        Pay Date: {formatDateString(corpAction.dates?.pay_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
  // console.log(userContext)
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
