'use client'

import styles from './corporate-actions.module.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CorporateAction, useCorpActionsStore } from '@/services/corporate-actions';
import EmailViewer from '../email-parser/email-viewer';
import { useScrollTo } from '@/lib/hooks';
import { RoleType, useUserContextStore } from '@/services/user-context';
import { DataGrid, getCurrencyColDefTemplate } from '../data-grid';
import { ColDef, GridApi, RowClickedEvent } from 'ag-grid-community';
import { corpActionsDataService } from '@/services/corporate-actions/corporate-actions-data';
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { Spinner } from "@radix-ui/themes";
import { formatDateString, tryParseAndFormat } from '@/lib/utility-functions/date-operations';
import Toggle from 'react-toggle';
import { CorporateActionHeader } from './corporate-actions-header';

export function CorporateActions() {

  const { userContext } = useUserContextStore();
  const { corpActions, selectedCorpAction, setSelectedCorpAction, searchCorpActions } = useCorpActionsStore();
  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>();
  const divRef = useRef<HTMLDivElement>(null);
  const gridApiRef = useRef<GridApi | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmailContent, setSelectedEmailContent] = useState<string>('');
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);
  const [isCompactViewEnabled, setIsCompactViewEnabled] = useState(false);

  // const [emailContents, setEmailContents] = useState<any>({});
  const virtualizer = useVirtualizer({
    count: corpActions.length,
    getScrollElement: () => divRef.current,
    estimateSize: () => 200,
    overscan: 5,
    gap: 10,
    paddingStart: 2,
    paddingEnd: 5
  });

  const colDefs = useMemo(() => getColumnDefs(), [])

  useEffect(() => {
    async function calculateSelectedEmailContent() {
      if (!selectedCorpAction?.eventId) {
        return;
      }

      const newContent = await corpActionsDataService.getCorpActionEmail(selectedCorpAction.eventId, selectedCorpAction.version!)
      setSelectedEmailContent(newContent);

      gridApiRef?.current?.forEachNode((node) =>
        node.setSelected(node.data && node.data?.eventId === selectedCorpAction?.eventId)
      );

      const selectedIndex = corpActions.findIndex(corpAction => selectedCorpAction?.eventId === corpAction.eventId);
      virtualizer.scrollToIndex(selectedIndex);
    }

    calculateSelectedEmailContent();

  }, [corpActions, selectedCorpAction, virtualizer]);

  function onSearchQueryChange(event: any) {
    setSearchQuery(event.target.value);
  }

  async function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    searchCorpActions(searchQuery);
  }

  function onSelectEmail(corpAction: CorporateAction, version: number | undefined) {
    setIsLoadingEmail(true);
    setSelectedEmailContent('');
    setSelectedCorpAction(corpAction);

    if (!corpAction.eventId || version === undefined) {
      setIsLoadingEmail(false);
      return;
    }

    corpActionsDataService
      .getCorpActionEmail(corpAction.eventId, version)
      .then(content => {
        setSelectedEmailContent(content);
        scrollToTarget();
      })
      .finally(() => setIsLoadingEmail(false));
  }

  function onRowClicked(event: RowClickedEvent) {
    onSelectEmail(event.data, event.data.version);
  }

  function getColumnDefs(): ColDef[] {
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
        width: 250,
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
    ];
  }

  const items = virtualizer.getVirtualItems();

  const corpActionsListElement = isCompactViewEnabled ?
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
    <div className={`${styles['corporate-actions-response']} scrollable-div`} ref={divRef}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}>
        {
          items
            .map((item: VirtualItem) => ({ item, corpAction: corpActions[item.index] }))
            .map(({ item, corpAction }) =>
            (
              <div
                key={item.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${item.start}px)`
                }}
                className={`${styles['corporate-action']} ${selectedCorpAction?.eventId === corpAction.eventId ? styles['active'] : ''}`}
                ref={virtualizer.measureElement}
                data-index={item.index}
              >
                <div
                  id={corpAction.eventId}
                  onClick={() => setSelectedCorpAction(corpAction)}>
                  <div className={styles['header']}>
                    <i className='fa-solid fa-microphone-lines'></i>
                    <div className={styles['title']}>
                      <div className={styles['top']}>
                        <span>Ticker: {corpAction.security?.identifiers?.ticker}</span>
                        <span className='margin-left-auto'>ISIN: {corpAction.security?.identifiers?.isin}</span>
                      </div>
                      <div className={styles['bottom']}>
                        <span>{corpAction.security?.name}</span>
                        <span className='margin-left-auto'>{corpAction.eventType}</span>
                        <span>{corpAction.eventStatus}</span>
                      </div>
                    </div>
                    <div className={styles['action-buttons']}>
                      <div className={styles['button-container']}>
                        <i className='fa-regular fa-envelope' onClick={() => onSelectEmail(corpAction, corpAction.version)}></i>
                      </div>

                    </div>
                  </div>

                  <div className={styles['corporate-action-body']}>
                    {/* <ReactMarkdown className='markdown' remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown> */}

                    <div className={styles['basic-info']}>
                      <div className="grid grid-cols-[45%_55%] gap-3 fs-13">
                        <div className='font-bold'>Announcement Id</div>
                        <div className='orange-color'>{corpAction?.eventId}</div>
                      </div>
                      <div className="grid grid-cols-[45%_55%] gap-3 fs-13">
                        <div className='font-bold'>Account</div>
                        <div>{corpAction.accounts?.length ? corpAction.accounts[0].accountNumber : ''}</div>
                      </div>
                      <div className="grid grid-cols-[45%_55%] gap-3 fs-13">
                        <div className='font-bold'>Position</div>
                        <div>{corpAction.accounts?.length ? corpAction.accounts[0].holdingQuantity : ''}</div>
                      </div>
                      {/*<div className="grid grid-cols-[40%_60%] gap-3 fs-13">*/}
                      {/*  <div className='font-bold'>Term Details</div>*/}
                      {/*  <div>{corpAction.termsDetails?.length ? (*/}
                      {/*      `Term: ${corpAction.termsDetails[0].termNumber} Rate: ${corpAction.termsDetails[0].type}`*/}
                      {/*  ) : ''}</div>*/}
                      {/*</div>*/}
                      <div className="grid grid-cols-[45%_55%] gap-3 fs-13">
                        <div className='font-bold'>Entitled Product Id</div>
                        <div>{corpAction.terms?.length ? corpAction.terms[0].security_details?.product_id : ''}</div>
                      </div>
                      <div className="grid grid-cols-[45%_55%] gap-3 fs-13">
                        <div className='font-bold'>Event Date</div>
                        <div>{formatDateString(corpAction.dates?.notification_date)}</div>
                      </div>
                    </div>

                    <div className='scrollable-div height-vh-15'>
                      <div className="grid grid-cols-[1fr_3fr] gap-3 fs-12 table-header text-center">
                        <div>Version</div>
                        <div>Date & Time</div>
                        {/*<div>Email</div>*/}
                        {/*<div>Alert</div>*/}
                      </div>
                      {
                        corpAction.versionHistory?.map(history =>
                          <div key={`${corpAction.eventId}-${history.version}`} className="grid grid-cols-[1fr_3fr] gap-3 fs-13 p-1 text-center">
                            <div className="blue-color cursor-pointer" onClick={() => onSelectEmail(corpAction, history.version)}>{history.version}</div>
                            <div >{tryParseAndFormat(history.changedDate!)}</div>
                            {/*<div className="blue-color cursor-pointer" onClick={() => onSelectEmail(corpAction, corpAction.id!)}>Y</div>*/}
                            {/*<div className="blue-color">{(history?.isCurrent ?? false) ? 'Y' : 'N'}</div>*/}
                          </div>
                        )
                      }
                    </div>
                  </div>

                  <div className={styles['footer']}>
                    <span>{`${corpAction.terms?.length ? (corpAction.terms[0]?.type + ' ' + corpAction.terms[0]?.rate) : ''}`}</span>
                  </div>
                </div>
              </div>
            )
            )
        }
      </div>
    </div>;
  // console.log(userContext)
  return (
    <>
    <CorporateActionHeader />
    <div className={styles['corporate-actions']}>
      <div className={styles['chatbot']}>
        <div className={styles['search-bar']} >
            <input
              type="text"
              value={searchQuery}
              onChange={event => onSearchQueryChange(event)}
              onKeyDown={onKeyDown}
              placeholder="Ask TransientAI anything about recent Corporate Actions. Include securities if you are looking for specific information" />
            {
              userContext.role == RoleType.Operations && <>
                <Toggle
                  checked={isCompactViewEnabled}
                  onChange={(e) => setIsCompactViewEnabled(e.target.checked)}
                />
                <span className="whitespace-nowrap">Compact View</span>
              </>
            }
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
        {
          isLoadingEmail
            ? <Spinner size="3" />
            : selectedCorpAction
              ? <EmailViewer
                className={styles['email-viewer'] + ' height-vh-90'}
                emailHtml={selectedEmailContent}
                scrollToSearchTerm={selectedCorpAction.eventId}
              />
              : <></>
        }
      </div>
    </div>
    </>
  );
}