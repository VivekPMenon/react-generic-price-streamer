'use client'

import styles from './corporate-actions.module.scss'
import { CorporateActionHeader } from './corporate-actions-header'
import { corpActionsDataService, useCorpActionsStore } from '@/services/corporate-actions'
import EmailViewer from '../email-parser/email-viewer'
import { OpsCorporateActions } from './ops-corporate-actions/ops-corporate-actions'
import { PmCorporateActions } from './pm-corporate-action/pm-corporate-action'
import { RoleType, useUserContextStore } from '@/services/user-context'
import { useEffect, useState } from 'react'
import { Spinner } from "@radix-ui/themes";
import { userService } from '@/services/user-context/user-service'

export const CorporateActions = () => {
  const { userContext } = useUserContextStore();
  const {
      selectedCorpAction,
      isSearching,
      isLoading
  } = useCorpActionsStore();
  const [selectedEmailContent, setSelectedEmailContent] = useState<string>('');
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);
  const previewRole = userService.getPreviewUserRole();

  useEffect(() => {
      async function calculateSelectedEmailContent() {
        setIsLoadingEmail(true);
        if (!selectedCorpAction?.eventId) {
          setIsLoadingEmail(false);
          return;
        }
  
        const newContent = await corpActionsDataService.getCorpActionEmail(selectedCorpAction.eventId, selectedCorpAction.version!)
        setSelectedEmailContent(newContent);
        setIsLoadingEmail(false);
      }
  
      calculateSelectedEmailContent();
  
    }, [selectedCorpAction]);

    const searchValue = (userContext.role == RoleType.PM)
      ? selectedCorpAction?.accounts && selectedCorpAction?.accounts[0].accountNumber
      : selectedCorpAction?.eventId;

  return (
    <div>
      <CorporateActionHeader />
      <section className={styles['corporate-actions']}>
        {isSearching ? (
          <div className='h-full flex justify-center items-center'>
            <Spinner size="3" />
          </div>
        ) : (
        <div className={styles['chatbot'] + ' scrollable-div'}>
          {(() => {
            switch (!previewRole ? userContext.role : previewRole) {
              case RoleType.PM: {
                return <PmCorporateActions />;
              }
              case RoleType.Operations: {
                return <OpsCorporateActions />;
              }
              default: {
                return <PmCorporateActions />;
              }
            }
          })()}
        </div>)}
        
        <div className={styles['email-content']}>
          {isLoadingEmail ? (
            <Spinner size="3" className='m-auto'/>
          ) : (
            <EmailViewer
              className={styles['email-viewer']}
              emailHtml={selectedEmailContent}
              scrollToSearchTerm={searchValue || ''}
             // selectedCorpAction?.accounts && selectedCorpAction?.accounts[0].accountNumber 
            />
          )}
          
        </div>
      </section>
    </div>
  )
}
