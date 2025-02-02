import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './corporate-actions.module.scss';

export function CorporateAction() {
  const markdown = `## Account Details

**Account:** 065492233-07  
**Holding Quantity:** -10  
**Term Details:** 1 SECURITIES DISTRIBUTION  
**Entitled Product ID:** 218937100 (CUS)  
**Pay Date:** **Jan 15, 2025**  



| **Type**     | **Date & Time**        | Y/N | Y/N |
|-------------|----------------------|---|---|
| **Original**  | Jan 07, 2025 - 00:46  | Y | Y |
| **Update 1**  | Jan 07, 2025 - 18:46  | Y | Y |
| **Update 2**  | Jan 13, 2025 - 16:49  | Y | Y |
| **Update 3**  | Jan 13, 2025 - 21:46  | Y | Y |
| **Update 4**  | Jan 14, 2025 - 12:48  | Y | Y |
`;

  return (
    <div className={styles['corporate-actions']}>
      <div className={styles['chatbot']}>
        <div className={styles['search-bar']} >
          <input type="text" placeholder="Ask TransientAI anything - use '@' to find files, folders and other trading data" />
        </div>

        <div className={styles['corporate-actions-response']}>

          <div className={styles['corporate-action']}>
            <div className={styles['header']}>
              <i className='fa-solid fa-microphone-lines'></i>
              Mandatory Event Information Update: Name Change: CONSOL ENERGY INC, CMS ISIN: US2086DFT67

              <div className={styles['action-buttons']}>
                <div className={styles['button-container']}>
                  <i className='fa-regular fa-envelope'></i>
                </div>

                <div className={styles['button-container']}>
                  <i className='fa-regular fa-bell'></i>
                </div>
              </div>
            </div>

            <div className='p-2'>
              <ReactMarkdown className='markdown' remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      <div className={styles['email-content']}>
        email
      </div>
    </div>
  );
}