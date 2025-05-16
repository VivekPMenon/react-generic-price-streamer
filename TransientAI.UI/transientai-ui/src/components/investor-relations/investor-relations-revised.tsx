import { useEffect, useRef, useState } from 'react';
import styles from './investor-relations-revised.module.scss';
import { Spinner } from '@radix-ui/themes';
import { InquiryFlag, InquiryRequest, InquiryStatus, investorRelationsService, IREmailMessage } from '@/services/investor-relations-data';
import Toggle from 'react-toggle';
import { useInvestorRelationsStore } from '@/services/investor-relations-data/investor-relations-store';
import { formatDate } from '@/lib/utility-functions/date-operations';
import EmailViewer from '../email-parser/email-viewer';
import { SearchableMarkdown } from '../markdown';
import { RequestFormPopup } from './request-form-popup';
import { toast } from 'react-toastify';
import { useUserContextStore } from '@/services/user-context';

export function InvestorRelationsRevised() {

  const testEmailId = 'awolfberg@hurricanecap.com';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [emailHtml, setEmailHtml] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isAiSummaryShown, setIsAiSummaryShown] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTaskOpen, setIsTaskOpen] = useState<boolean>(false);
  const [isCompletedItemsShown, setIsCompletedItemsShown] = useState<boolean>(false);

  const createTaskRef = useRef<HTMLInputElement>(null);

  const { irEmails, inquiries, selectedIrEmail, selectedInquiry, setSelectedIrEmail, setSelectedInquiry, loadInquiries, loadEmails, changeStatus, updateStatusFromCompleted } = useInvestorRelationsStore();

  useEffect(() => {
    if (selectedIrEmail)
      onEmailSelection(selectedIrEmail);
  }, [selectedIrEmail]);

  async function onEmailSelection(email: IREmailMessage) {
    const userContext = useUserContextStore.getState().userContext;

    const [emailContent, aiContent] = await Promise.all([
      investorRelationsService.getEmailContentAsHtml(email.id!, userContext.userId!),
      investorRelationsService.getIRSummary(email.id!, userContext.userId!)
    ]);

    setAiSummary(aiContent.ir_summary);
    setEmailHtml(emailContent);
  }

  async function markEmailComplete(event: any, irEmail: IREmailMessage) {
    event.stopPropagation();
    try {
      setIsSaving(true);
      const userContext = useUserContextStore.getState().userContext;

      await investorRelationsService.markIrEmailAsComplete(irEmail.id!, userContext.userId!);
      await loadEmails();

      toast.success('Email marked as complete');
    } catch (error) {
      toast.error('Error while trying to mark the email as complete');
    }
    setIsSaving(false);
  }

  async function markTaskComplete(event: any, inquiry: InquiryRequest) {
    event.stopPropagation();
    try {
      setIsSaving(true);

      inquiry.completed = true;
      updateStatusFromCompleted(inquiry);
      await changeStatus(inquiry.id!, inquiry.status!);

      toast.success('Task marked as complete');
    } catch (error) {
      toast.error('Error while trying to mark the email as complete');
    }
    setIsSaving(false);
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
            placeholder='Filter IR Requests By Subject'
            onChange={event => setSearchQuery(event.target.value)}
            value={searchQuery}
          />
          {searchQuery ?
            <i className='fa-solid fa-remove' onClick={() => { setSearchQuery(''); }}></i> :
            <i className='fa-solid fa-magnifying-glass'></i>}
        </div>
        {/* 
        <div className={styles['prompt-results']}>
          Prompt Results - TODO -- What does it go here? Is it plain text?
        </div> */}

        <div className={styles['mail-inbox']}>
          <div className={styles['title']}>
            <i className='fa-regular fa-envelope'></i>
            Inbox
            {
              isSaving && <Spinner size={"2"} />
            }

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
              .filter(msg => (isCompletedItemsShown ? msg.complete : !msg.complete)
                && (!searchQuery || msg.subject.toLowerCase().includes(searchQuery.toLowerCase())))
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${selectedIrEmail?.id === msg.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedIrEmail(msg); setSelectedInquiry(null) }}
                >
                  {/* move this to a common comp */}
                  <div className={`radio-button-container ${msg.complete ? 'checked' : ''}`}
                    title='Mark as Completed'
                    onClick={(event) => markEmailComplete(event, msg)}>
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
              .filter(msg => (isCompletedItemsShown ? msg.status === InquiryStatus.Completed : msg.status !== InquiryStatus.Completed)
                && (!searchQuery || msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${selectedInquiry?.id === msg.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedIrEmail(null);
                    setSelectedInquiry(msg);
                  }}
                >
                  <div className={`radio-button-container ${msg.status === InquiryStatus.Completed ? 'checked' : ''}`} title='Mark as Completed' onClick={(event) => markTaskComplete(event, msg)}>
                    <i className="fa-solid fa-check"></i>
                  </div>

                  <div className='content'>
                    <div className='header'>
                      <span className='sender'>
                        {msg.flag === InquiryFlag.Urgent && <span className='priority'>❗</span>}
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

      {
        selectedInquiry &&
        <div className={styles['inquiry-summary']}>
          <div className='fs-16'>Task Summary</div>
          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Subject:</span> {selectedInquiry?.subject}
          </div>

          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Assigned By:</span> {selectedInquiry?.owner_name}
          </div>

          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Assignee:</span> {selectedInquiry?.assignee_name}
          </div>

          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Inquiry:</span> {selectedInquiry?.inquiry}
          </div>

          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Status:</span> {selectedInquiry?.status}
          </div>

          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Due Date:</span> {formatDate(selectedInquiry?.due_date)}
          </div>

          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Flag:</span> {selectedInquiry?.flag}
          </div>
        </div>
      }

    </div>
  );
}