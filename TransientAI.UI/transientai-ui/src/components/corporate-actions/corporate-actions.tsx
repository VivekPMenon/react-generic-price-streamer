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

  const items = [
    {
      value: 'item-1',
      title: 'What is an Accordion?',
      titleTextStyle: 'text-red-500',
      content: (
        <PmCorporateActions/> 
        
      )
    },
    {
      value: 'item-2',
      title: 'Accessibility Features',
      titleTextStyle: 'text-green-500',
      content: (
        <OpsCorporateActions/>
      )
    },
    {
      value: 'item-3',
      title: 'Customization Options',
      titleTextStyle: 'text-green-500',
      content: (
        <OpsCorporateActions/>
      )
    }
  ]

  return (
    <div>
      <CorporateActionHeader />
      <section className={styles['corporate-actions']}>
        <div className={styles['chatbot']}>
          <Accordion items={items} type='multiple' />
          {/* <OpsCorporateActions/> */}
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
