'use client'

import { useEffect, useRef} from 'react'
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual'
import { formatDateString } from '@/lib/utility-functions/date-operations'
import styles from './ops.module.scss'
import { CorporateAction, useCorpActionsStore } from '@/services/corporate-actions'
import { getDateElement } from '../corporate-actions'

interface OpsListProps {
  data: CorporateAction[]
}

export function OpsList ({ data }: OpsListProps) {
 const divRef = useRef<HTMLDivElement>(null)
 const { selectedCorpAction, isLoading, setSelectedCorpAction} = useCorpActionsStore();

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

  const items = virtualizer.getVirtualItems();
  
    useEffect(() => {
      const selectedIndex = data.findIndex(data => selectedCorpAction?.eventId === data.eventId);
      virtualizer.scrollToIndex(selectedIndex);
  
    }, [data, selectedCorpAction, virtualizer]);

    
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
                selectedCorpAction?.eventId === corpAction?.eventId
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
                        General Corp Action - {corpAction.action}
                      </span>
                    </div>
                    <div className='text-gray-400'>
                      Holding: {corpAction.holdingQuantity} | {
                        corpAction.versionHistory && (() => {
                          const matchedVersion = corpAction.versionHistory.find(
                            (vers) => vers.version === corpAction.version
                          );
                          return matchedVersion ? (
                            <span key={matchedVersion.changedDate} className=''>
                              Version: {matchedVersion.version} &nbsp;|&nbsp; {formatDateString(matchedVersion.changedDate)}
                            </span>
                          ) : null;
                        })()
                      }
                    </div>
                  </div>
                  <div className='flex justify-between mt-1'>
                    <div>
                      <span>{corpAction?.security && corpAction?.security.name}</span>
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
                      {getDateElement(corpAction.viewType,corpAction)}
                      {/* <span className='ml-4'>
                          Pay Date: {corpAction.dates?.pay_date && new Date(corpAction.dates.pay_date).getFullYear() >= 2000 ? formatDateString(corpAction.dates.pay_date) : 'NA'}
                      </span> */}
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
      <div className={styles['chatbot']}>
        {isLoading ? (
          <p className="text-center my-auto">Loading...</p>
        ) : (
          data?.length > 0 ? (
            corpActionsListElement
          ) : (
            <p className="text-center my-auto">No data Found</p>
          )
        )}
      </div>
    </>
  )
}
