'use client'

import styles from './corporate-actions.module.scss';
import { useContext, useEffect, useState } from 'react';
import { CorpActionsDataContext, CorporateAction } from '@/services/corporate-actions';
import { getEmailSource, getCorpActions } from '@/services/corporate-actions/corporate-actions-data';
import EmailViewer from '../email-parser/email-viewer';
import { useScrollTo } from '@/lib/hooks';

export interface CorporateActionsProps {
  isExpanded?: boolean;
}

export function CorporateActions({ isExpanded }: CorporateActionsProps) {

  const { corpActionsData, setCorpActionsData } = useContext(CorpActionsDataContext);
  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmailContent, setSelectedEmailContent] = useState<string>('');
  const [emailContents, setEmailContents] = useState<any>({});

  useEffect(() => { loadEmailContents(); }, []);
  useEffect(() => { calculateSelectedEmailContent() }, [corpActionsData?.corpActions]); // hack.. we should not useeffect on state pbjects

  async function loadEmailContents() {
    const emailContents: any = await getEmailSource();
    setEmailContents(emailContents);
  }

  async function calculateSelectedEmailContent() {
    if(corpActionsData.corpActions?.length! < 1) {
      return;
    }

    const newContent = emailContents[`${corpActionsData!.corpActions![0].eventId + '_2'}`]
    setSelectedEmailContent(newContent);
  }

  function onSearchQueryChange(event: any) {
    setSearchQuery(event.target.value);
  }

  async function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    const corpActions = await getCorpActions();
    setCorpActionsData({ corpActions });
  }

  function onSelectEmail(corpAction: CorporateAction, version: string) {
    const newEmailContent = emailContents[corpAction.eventId + '_' + version]
    setSelectedEmailContent(newEmailContent);
    scrollToTarget();
  }

  return (
    <div className={styles['corporate-actions']}>
      <div className={styles['chatbot']}>
        <div className={styles['search-bar']} >
          <input
            type="text"
            value={searchQuery}
            onChange={event => onSearchQueryChange(event)}
            onKeyDown={onKeyDown}
            placeholder="Ask TransientAI anything about recent Corporate Actions. Include securities if you are looking for specific information" />
        </div>

        {
          corpActionsData?.corpActions?.length ?
            <div className={`${styles['corporate-actions-response']}`}>
              {
                corpActionsData.corpActions?.map(corpAction =>
                  <div className={styles['corporate-action']}>
                    <div className={styles['header']}>
                      <i className='fa-solid fa-microphone-lines'></i>
                      {corpAction.eventDescription}

                      <div className={styles['action-buttons']}>
                        <div className={styles['button-container']}>
                          <i className='fa-regular fa-envelope' onClick={() => onSelectEmail(corpAction, '2')}></i>
                        </div>

                      </div>
                    </div>

                    <div className={styles['corporate-action-body']}>
                      {/* <ReactMarkdown className='markdown' remarkPlugins={[remarkGfm]}>
                      {markdown}
                    </ReactMarkdown> */}

                      <div className={styles['basic-info']}>
                        <div className="grid grid-cols-[40%_60%] gap-3 fs-13">
                          <div className='font-bold'>Announcement Id</div>
                          <div className='orange-color'>{corpAction.eventId}</div>
                        </div>
                        <div className="grid grid-cols-[40%_60%] gap-3 fs-13">
                          <div className='font-bold'>Account</div>
                          <div>{corpAction.accountId}</div>
                        </div>
                        <div className="grid grid-cols-[40%_60%] gap-3 fs-13">
                          <div className='font-bold'>Holding Quantity</div>
                          <div>{corpAction.holdingQuantity}</div>
                        </div>
                        <div className="grid grid-cols-[40%_60%] gap-3 fs-13">
                          <div className='font-bold'>Term Details</div>
                          <div>{corpAction.termDetails}</div>
                        </div>
                        <div className="grid grid-cols-[40%_60%] gap-3 fs-13">
                          <div className='font-bold'>Entitled Product Id</div>
                          <div>{corpAction.entitledProductId}</div>
                        </div>
                        <div className="grid grid-cols-[40%_60%] gap-3 fs-13">
                          <div className='font-bold'>Pay Date</div>
                          <div>{corpAction.paydate}</div>
                        </div>
                      </div>

                      <div>
                        <div className="grid grid-cols-[1fr_3fr_1fr_1fr] gap-3 fs-12 table-header text-center">
                          <div>Version</div>
                          <div>Date & Time</div>
                          <div>Email</div>
                          <div>Alert</div>
                        </div>
                        {
                          corpAction.updateHistory?.map(history =>
                            <div className="grid grid-cols-[1fr_3fr_1fr_1fr] gap-3 fs-13 p-1 text-center">
                              <div>{history.type}</div>
                              <div >{history.date}</div>
                              <div className="blue-color cursor-pointer" onClick={() => onSelectEmail(corpAction, history.type)}>Y</div>
                              <div className="blue-color">Y</div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                )
              }



            </div> : <></>
        }
      </div>

      <div className={styles['email-content']} ref={scrollTargetRef}>
        {/* <SearchableMarkdown 
          markdownContent={reportsDataService.getEmailContentMock()} 
          className={isExpanded ? 'height-vh-82' : 'height-vh-40'} 
          title='Original Email'/> */}
        {selectedEmailContent ?
          <EmailViewer className={styles['email-viewer']} htmlSource={selectedEmailContent} /> : <></>}

      </div>
    </div>
  );
}