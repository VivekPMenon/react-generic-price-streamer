import styles from './corporate-actions.module.scss'
import { CorporateActionHeader } from './corporate-actions-header'
import { useCorpActionsStore } from '@/services/corporate-actions'
import EmailViewer from '../email-parser/email-viewer'
import { Accordion } from '../accordion/accordion'
import { OpsCorporateActions } from './ops-corporate-actions/ops-corporate-actions'
import { PmCorporateActions } from './pm-corporate-action/pm-corporate-action'

export const CorporateActions = () => {
  const {
    corpActions,
    selectedCorpAction,
    setSelectedCorpAction,
    searchCorpActions
  } = useCorpActionsStore()

  return (
    <div>
      <CorporateActionHeader />
      <section className={styles['corporate-actions']}>
        <div className={styles['chatbot']}>
          
          {/* <OpsCorporateActions/> */}
          <PmCorporateActions/>
        </div>

        <div className={styles['email-content']}>
          <EmailViewer
            className={styles['email-viewer'] + ' height-vh-90'}
            emailHtml={''}
            scrollToSearchTerm={''}
          />
        </div>
      </section>
    </div>
  )
}
