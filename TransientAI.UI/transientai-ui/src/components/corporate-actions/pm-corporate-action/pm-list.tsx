'use client'

import styles from './pm.module.scss'

import { useRef, useState } from 'react'
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual'
import { CorporateAction } from './models'
import { formatDateString } from '@/lib/utility-functions/date-operations'

interface PmListProps {
  data: CorporateAction[]
}

export function PmList ({ data }: PmListProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [selectedCorpAction, setSelectedCorpAction] =
    useState<CorporateAction>()

  // const [emailContents, setEmailContents] = useState<any>({});
  const virtualizer = useVirtualizer({
    count: data.length,
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
            corpAction: data[item.index]
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
                selectedCorpAction?.event_id === corpAction?.event_id
                  ? styles['active']
                  : ''
              }`}
              ref={virtualizer.measureElement}
              data-index={item.index}
            >
              <div
                id={corpAction.event_id}
                onClick={() => setSelectedCorpAction(corpAction)}
              >
                <div className='p-2 w-full font-sans'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='font-bold'>
                      <i className='fa-solid fa-microphone-lines mr-2'></i>
                      Ticker: {corpAction.ticker}
                    </span>
                    <span className='text-green-500'>
                      {corpAction.event_type}
                    </span>
                    <span className='flex items-center gap-2'>
                      Deadline: {formatDateString(corpAction.dates.deadline)}
                      <div className={styles['action-buttons']}>
                        <div className={styles['button-container']}>
                          <i className='fa-regular fa-envelope'></i>
                        </div>
                      </div>
                    </span>
                  </div>

                  <div className='mb-2'>
                    <div className=''>{corpAction.security_name}</div>
                  </div>

                  <div className='grid grid-cols-3 justify-between items-start gap-2'>
                    <div className='col-span-2 grid grid-cols-2 items-start'>
                      <div className='grid grid-cols-1'>
                        <span>{corpAction.event_status}</span>
                        <span>ISIN : {corpAction.security.isin}</span>
                        <span className=''>ID: {corpAction.event_id}</span>
                        <span className=''>
                          No. Accounts: {corpAction.num_accounts}
                        </span>
                      </div>
                      <div className='grid grid-cols-1'>
                        {corpAction.accounts.map(acc => (
                          <span key={acc.account_number} className=''>
                            Account: {acc.account_number} &nbsp; Holding : {acc.holding_quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className='grid grid-cols-1'>
                        {
                            corpAction.versionsInfo.map((vers)=>
                                <span key={vers.versionId} className=''>
                        Version: {vers.versionId} &nbsp;|&nbsp; {formatDateString(vers.date)}
                      </span>
                            )
                        }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
  return (
    <>
      <div className={styles['corporate-actions']}>
        <div className={styles['chatbot']}>
          {data?.length ? corpActionsListElement : <></>}
        </div>
      </div>
    </>
  )
}
