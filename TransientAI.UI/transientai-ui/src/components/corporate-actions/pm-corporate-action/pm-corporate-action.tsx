'use client'

import styles from './pm.module.scss'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual'
import { formatDateString } from '@/lib/utility-functions/date-operations'
import opsData from '../ops-corporate-actions/ops_view_output.json'

export function PmCorporateActions () {
  const divRef = useRef<HTMLDivElement>(null)
  const [selectedCorpAction, setSelectedCorpAction] = useState<any>()

  // const [emailContents, setEmailContents] = useState<any>({});
  const virtualizer = useVirtualizer({
    count: opsData.data.length,
    getScrollElement: () => divRef.current,
    estimateSize: () => 200,
    overscan: 5,
    gap: 10,
    paddingStart: 2,
    paddingEnd: 5
  })

  const items = virtualizer.getVirtualItems()

  const corpActionsListElement = (
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
                <div className='p-2 w-full font-sans'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='font-bold'>
                    <i className='fa-solid fa-microphone-lines mr-2'></i>
                      Ticker: SEB
                    </span>
                    <span className='text-green-500'>
                    Action Required: Optional Dividend
                    </span>
                    <span className=''>Deadline: Mar 25 2025 09:30 HK</span>
                    <div className={styles['action-buttons']}>
                      <div className={styles['button-container']}>
                        <i className='fa-regular fa-envelope'></i>
                      </div>
                    </div>
                  </div>

                  <div className='mb-2'>
                    <div className=''>LONGFOR GROUP HOLDINGS LTD. CMN</div>
                  </div>

                  <div className='grid grid-cols-3 justify-between items-start gap-2'>
                    <div className='col-span-2 grid grid-cols-2 items-start'>
                      <div className='grid grid-cols-1'>
                        <span>Confirmed</span>
                        <span>ISIN : US208S4L1089</span>
                        <span className=''>ID: 83215121</span>
                        <span className=''>No. Accounts: 1</span>
                      </div>
                      <div className='grid grid-cols-1'>
                        <span className=''>Account: 065464984 Holding : 152</span>
                        <span className=''>Account: 06546494 Holding : 10</span>
                      </div>
                    </div>
                    <div className='grid grid-cols-1'>
                      <span className=''>
                        Version: 1 | Mar XX 2025 00:00 ET
                      </span>
                      <span className=''>
                        Version: 2 | Mar 13 2025 07:29 ET
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
          {opsData?.data?.length ? corpActionsListElement : <></>}
        </div>
      </div>
    </>
  )
}
