import { useState } from 'react';
import styles from './corporate-actions.module.scss';
import { RoleType, useUserContextStore } from '@/services/user-context';
import { CorporateActionHeader } from "./corporate-actions-header"
import { CorporateAction, useCorpActionsStore } from '@/services/corporate-actions';
import EmailViewer from '../email-parser/email-viewer';
import { Spinner } from "@radix-ui/themes";

export const CorporateActions = () => {
    const { corpActions, selectedCorpAction, setSelectedCorpAction, searchCorpActions } = useCorpActionsStore();

    return(
        <div>
            <CorporateActionHeader />

            <section className={styles['corporate-actions']}>
                <div className={styles['chatbot']}>
                    Action Required and no action required
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