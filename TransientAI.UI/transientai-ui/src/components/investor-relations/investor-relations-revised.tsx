import { useEffect, useRef, useState } from 'react';
import styles from './investor-relations-revised.module.scss';
import { Spinner } from '@radix-ui/themes';
import { InquiryFlag, InquiryRequest, investorRelationsService, IREmailMessage } from '@/services/investor-relations-data';
import EmailHeader from '../email-header/email-header';
import Toggle from 'react-toggle';
import { useInvestorRelationsStore } from '@/services/investor-relations-data/investor-relations-store';
import { formatDate } from '@/lib/utility-functions/date-operations';
import { researchReportsDataService } from '@/services/reports-data';
import EmailViewer from '../email-parser/email-viewer';
import { SearchableMarkdown } from '../markdown';
import { RequestFormPopup } from './request-form-popup';
import { toast } from 'react-toastify';

export function InvestorRelationsRevised() {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [emailHtml, setEmailHtml] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isAiSummaryShown, setIsAiSummaryShown] = useState<boolean>(false);
  const [isTaskOpen, setIsTaskOpen] = useState<boolean>(false);
  const [isCompletedItemsShown, setIsCompletedItemsShown] = useState<boolean>(false);

  const createTaskRef = useRef<HTMLInputElement>(null);

  const { irEmails, inquiries, selectedIrEmail, selectedInquiry, setSelectedInquiry, setSelectedIrEmail, loadInquiries } = useInvestorRelationsStore();

  useEffect(() => {
    if (selectedIrEmail)
      onEmailSelection(selectedIrEmail);
  }, [selectedIrEmail]);

  async function onEmailSelection(email: IREmailMessage) {
    const [emailContent, aiContent] = await Promise.all([
      researchReportsDataService.getEmailContentAsHtml(email.id!, 'awolfberg@hurricanecap.com'),
      investorRelationsService.getIRSummary(email.id!, 'awolfberg@hurricanecap.com')
    ]);

    setAiSummary(aiContent.ir_summary);
    setEmailHtml(emailContent);
  }

  async function markEmailComplete(event: any) {
    event.stopPropagation();
  }

  async function markTaskComplete(event: any) {
    event.stopPropagation();
  }

  const toggleElement =
    <div className={styles['ir-response-toggler']}>
      Show AI Summary
      <Toggle
        id='sort-action'
        defaultChecked={isAiSummaryShown}
        checked={isAiSummaryShown}
        onChange={() => setIsAiSummaryShown(!isAiSummaryShown)}
      />
    </div>;

  return (
    <div className={styles['investor-relations']}>
      <div className={styles['ir-requests']}>
        <div className={styles['title']}>
          IR Requests

          <i className='fa-regular fa-pen-to-square' ref={createTaskRef} onClick={() => setIsTaskOpen(true)}></i>

          {
            isTaskOpen && <RequestFormPopup
              open={true}
              onSubmitted={(msg) => { loadInquiries(); toast.success(msg) }}
              subject={selectedInquiry?.subject}
              inquiry={selectedInquiry?.inquiry}
              dueDate={selectedInquiry?.due_date}
              flag={selectedInquiry?.flag}
              assignee={selectedInquiry?.assignee_name}
              isReadOnly={!!selectedInquiry}
              onClose={() => { setSelectedInquiry(null); setIsTaskOpen(false); }}>
            </RequestFormPopup>
          }

        </div>

        <div className={styles['search-box']}>
          <input
            type='text'
            className='mb-2'
            autoFocus={true}
            autoComplete='on'
            placeholder='Ask IR Portal'
          />
          {searchQuery ?
            <i className='fa-solid fa-remove' onClick={() => { setSearchQuery(''); }}></i> :
            <i className='fa-solid fa-magnifying-glass'></i>}
        </div>

        <div className={styles['prompt-results']}>
          Prompt Results - TODO -- What does it go here? Is it plain text?
        </div>

        <div className={styles['mail-inbox']}>
          <div className={styles['title']}>
            <i className='fa-regular fa-envelope'></i>
            Inbox

            <div className={styles['toggler']}>
              Show Completed Items
              <Toggle
                className='toggle-small'
                id='sort-action'
                defaultChecked={isCompletedItemsShown}
                checked={isCompletedItemsShown}
                onChange={() => setIsCompletedItemsShown(!isCompletedItemsShown)}
              />
            </div>
          </div>

          <div className={`${styles['messages']} message-list scrollable-div`}>
            {irEmails
              .filter(msg => isCompletedItemsShown ? msg.complete : true)
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${selectedIrEmail?.id === msg.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedIrEmail(msg); setSelectedInquiry(null) }}
                >
                  {/* move this to a common comp */}
                  <div className={`radio-button-container ${msg.complete ? 'checked' : ''}`} title='Mark as Completed' onClick={(event) => markEmailComplete(event)}>
                    <i className="fa-solid fa-check"></i>
                  </div>

                  <div className='content'>
                    <div className='header'>
                      <span className='sender'>
                        {msg.important && <span className='priority'>❗</span>}
                        {msg.sender}
                      </span>
                      <span className='time'>{formatDate(msg.received)}</span>
                    </div>
                    <div className='subject'>{msg.subject}</div>
                    {/* <div className='body'>{msg.concise_summary}</div> */}
                  </div>
                </div>
              ))}

            {inquiries
              .filter(msg => isCompletedItemsShown ? msg.completed : true)
              .map((msg, idx) => (
              <div
                key={idx}
                className={`message ${selectedInquiry?.id === msg.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedIrEmail(null);
                  setSelectedInquiry(msg);
                  setIsTaskOpen(true);
                }}
              >
                <div className={`radio-button-container ${msg.completed ? 'checked' : ''}`} title='Mark as Completed' onClick={(event) => markTaskComplete(event)}>
                  <i className="fa-solid fa-check"></i>
                </div>

                <div className='content'>
                  <div className='header'>
                    <span className='sender'>
                      {msg.flag === InquiryFlag.Important && <span className='priority'>❗</span>}
                      {msg.owner_name}
                    </span>
                    <span className='time'>{formatDate(msg.date)}</span>
                  </div>
                  <div className='subject'>{msg.subject}</div>

                  <div className='body'>
                    <div className='body-content-left'>
                      <span>Assignee: {msg.assignee_name}</span>
                      <span>Due Date: {formatDate(msg.due_date)}</span>
                    </div>

                    <div className='body-content-right'>
                      <div className='pill teal'>TASK</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {
        selectedIrEmail &&
        <div className={styles['ir-responses']}>
          {
            isAiSummaryShown ?
              <SearchableMarkdown className={styles['summary-viewer']} markdownContent={aiSummary}>
                {toggleElement}
              </SearchableMarkdown>
              :
              <EmailViewer className={styles['summary-viewer']} emailHtml={emailHtml}>
                {toggleElement}
              </EmailViewer>
          }

        </div>
      }

    </div>
  );
}