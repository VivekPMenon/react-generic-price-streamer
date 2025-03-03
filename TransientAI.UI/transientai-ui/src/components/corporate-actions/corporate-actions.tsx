'use client'

import styles from './corporate-actions.module.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CorporateAction, useCorpActionsStore } from '@/services/corporate-actions';
import EmailViewer from '../email-parser/email-viewer';
import { useScrollTo } from '@/lib/hooks';
import { RoleType, useUserContextStore } from '@/services/user-context';
import { DataGrid, getNumberColDefTemplate } from '../data-grid';
import { ColDef, GridApi, RowClickedEvent } from 'ag-grid-community';
import { corpActionsDataService } from '@/services/corporate-actions/corporate-actions-data';

export interface CorporateActionsProps {
  isExpanded?: boolean;
}

export function CorporateActions({ isExpanded }: CorporateActionsProps) {

  const { userContext } = useUserContextStore();
  const { corpActions, selectedCorpAction } = useCorpActionsStore();
  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>();
  const gridApiRef = useRef<GridApi | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmailContent, setSelectedEmailContent] = useState<string>('');
  const [emailContents, setEmailContents] = useState<any>({});

  const colDefs = useMemo(() => getColumnDefs(), [])

  useEffect(() => { loadEmailContents(); }, []);
  useEffect(() => { calculateSelectedEmailContent() }, [emailContents, selectedCorpAction]); // hack.. we should not useeffect on state pbjects

  async function loadEmailContents() {
    const emailContents: any = await corpActionsDataService.getEmailSource();
    setEmailContents(emailContents);
  }

  async function calculateSelectedEmailContent() {
    if (corpActions?.length! < 1) {
      return;
    }

    const newContent = emailContents[`${corpActions![0].eventId + '_2'}`]
    setSelectedEmailContent(newContent);

    gridApiRef?.current?.forEachNode((node) => 
      node.setSelected(node.data && node.data?.eventId === selectedCorpAction?.eventId)
    );
  }

  function onSearchQueryChange(event: any) {
    setSearchQuery(event.target.value);
  }

  async function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    // const corpActions = await corpActionsDataService.getCorpActions();
    // setCorpActions(corpActions);
  }

  function onSelectEmail(corpAction: CorporateAction, version: string) {
    const newEmailContent = emailContents[corpAction.eventId + '_' + version]
    setSelectedEmailContent(newEmailContent);
    scrollToTarget();
  }

  function onRowClicked(event: RowClickedEvent) {
    onSelectEmail(event.data, '2');
  }

  function getColumnDefs(): ColDef[] {
    return [
      {
        field: 'eventId',
        headerName: 'Announcement ID',
        width: 120,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'ticker',
        headerName: 'Ticker',
        width: 90,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'isin',
        headerName: 'ISIN',
        width: 120,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'security',
        headerName: 'Security Name',
        width: 120,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'eventType',
        headerName: 'Event Type',
        width: 120,
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
        width: 100,
        filter: 'agSetColumnFilter'
      },
      {
        field: 'holdingQuantity',
        headerName: 'Holding',
        width: 90,
        ...getNumberColDefTemplate(),
        filter: 'agNumberColumnFilter'
      },
      {
        field: 'keyDates',
        headerName: 'Key Dates',
        width: 120,
        // filter: 'agDateColumnFilter'
      },
      // {
      //   field: 'eventDate',
      //   headerName: 'Event Date',
      //   width: 120,
      //   sort: 'desc',
      //   filter: 'agDateColumnFilter'
      // },
      {
        field: 'version',
        headerName: 'Version',
        width: 100,
        filter: 'agNumberColumnFilter'
      }
    ];
  }

  const corpActionsListElement = userContext.role === RoleType.Operations ?
    <DataGrid
      ref={gridApiRef}
      className='p-2'
      columnDefs={colDefs}
      rowData={corpActions}
      isSummaryGrid={true}
      onRowClicked={onRowClicked}
      rowSelection={'single'}
      >
    </DataGrid>
    :
    <div className={`${styles['corporate-actions-response']}`}>
      {
        corpActions?.map(corpAction =>
          <div className={styles['corporate-action']}>
            <div className={styles['header']}>
              <i className='fa-solid fa-microphone-lines'></i>
              {corpAction.action}

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
                  <div>{corpAction.accountDetails?.length ? corpAction.accountDetails[0].accountNumber : ''}</div>
                </div>
                <div className="grid grid-cols-[40%_60%] gap-3 fs-13">
                  <div className='font-bold'>Holding Quantity</div>
                  <div>{corpAction.holdingQuantity}</div>
                </div>
                <div className="grid grid-cols-[40%_60%] gap-3 fs-13">
                  <div className='font-bold'>Term Details</div>
                  <div>{corpAction.termsDetails?.length ? (
                      `Term: ${corpAction.termsDetails[0].termNumber} Rate: ${corpAction.termsDetails[0].type}`
                  ) : ''}</div>
                </div>
                {/*<div className="grid grid-cols-[40%_60%] gap-3 fs-13">*/}
                {/*  <div className='font-bold'>Entitled Product Id</div>*/}
                {/*  <div>{corpAction.entitledProductId}</div>*/}
                {/*</div>*/}
                <div className="grid grid-cols-[40%_60%] gap-3 fs-13">
                  <div className='font-bold'>Pay Date</div>
                  <div>{corpAction.termsDetails?.length ? corpAction.termsDetails[0].payDate : ''}</div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-[1fr_3fr_1fr_1fr] gap-3 fs-12 table-header text-center">
                  <div>Version</div>
                  <div>Date & Time</div>
                  <div>Email</div>
                  <div>Alert</div>
                </div>
                {/*{*/}
                {/*  corpAction.updateHistory?.map(history =>*/}
                {/*    <div className="grid grid-cols-[1fr_3fr_1fr_1fr] gap-3 fs-13 p-1 text-center">*/}
                {/*      <div>{history.type}</div>*/}
                {/*      <div >{history.date}</div>*/}
                {/*      <div className="blue-color cursor-pointer" onClick={() => onSelectEmail(corpAction, history.type)}>Y</div>*/}
                {/*      <div className="blue-color">Y</div>*/}
                {/*    </div>*/}
                {/*  )*/}
                {/*}*/}
              </div>
            </div>
          </div>
        )
      }
    </div>;

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
          corpActions?.length ? corpActionsListElement : <></>
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