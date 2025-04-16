'use client'

import styles from './notes-ai.module.scss'
import NotesList from './notes-list'
import NotesDetail from './notes-details'

export const NotesAi = () => {

  
  return (
    <section className={styles['notes-main-content']}>
      <div className={styles['notes-content'] + ' scrollable-div'}>
        <NotesList />
      </div>

      <div className={styles['notes-detail-view']}>
        <NotesDetail />
      </div>
    </section>
  )
}
