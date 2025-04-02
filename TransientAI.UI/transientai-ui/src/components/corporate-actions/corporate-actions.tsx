'use client'

import styles from './corporate-actions.module.scss'
import { CorporateActionHeader } from './corporate-actions-header'
import { corpActionsDataService, useCorpActionsStore } from '@/services/corporate-actions'
import EmailViewer from '../email-parser/email-viewer'
import { OpsCorporateActions } from './ops-corporate-actions/ops-corporate-actions'
import { PmCorporateActions } from './pm-corporate-action/pm-corporate-action'
import { RoleType, useUserContextStore } from '@/services/user-context'
import { useEffect, useState } from 'react'

export const CorporateActions = () => {
  const { userContext } = useUserContextStore();
  const {
      selectedCorpAction
  } = useCorpActionsStore();
  const [selectedEmailContent, setSelectedEmailContent] = useState<string>('');

  useEffect(() => {
      async function calculateSelectedEmailContent() {
        if (!selectedCorpAction?.eventId) {
          return;
        }
  
        const newContent = await corpActionsDataService.getCorpActionEmail(selectedCorpAction.eventId, selectedCorpAction.version!)
        setSelectedEmailContent(newContent);
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
        <div className={styles['chatbot'] + ' scrollable-div'}>
          {(() => {
            switch (userContext.role) {
              case RoleType.PM: {
                return <PmCorporateActions />;
              }
              case RoleType.Operations: {
                return <OpsCorporateActions />;
              }
              default: {
                return <OpsCorporateActions />;
              }
            }
          })()}
        </div>
        

        <div className={styles['email-content']}>
          <EmailViewer
            className={styles['email-viewer']}
            emailHtml={selectedEmailContent}
            scrollToSearchTerm={searchValue || ''} // selectedCorpAction?.accounts && selectedCorpAction?.accounts[0].accountNumber 
          />
        </div>
      </section>
    </div>
  )
}
