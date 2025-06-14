import { useEffect, useRef, useState } from 'react';
import styles from './investor-relations-revised.module.scss';
import { Button, Spinner, Tabs } from '@radix-ui/themes';
import { InquiryFlag, InquiryRequest, InquiryStatus, investorRelationsService, IREmailMessage } from '@/services/investor-relations-data';
import Toggle from 'react-toggle';
import { useInvestorRelationsStore } from '@/services/investor-relations-data/investor-relations-store';
import { formatDate } from '@/lib/utility-functions/date-operations';
import EmailViewer from '../email-parser/email-viewer';
import { SearchableMarkdown } from '../markdown';
import { RequestFormPopup } from './request-form-popup';
import { toast } from 'react-toastify';
import { useUserContextStore } from '@/services/user-context';
import EmailAction, { Recipient } from './email-action';
import { userService } from '@/services/user-context/user-service';
import { TaDialog } from '../shared/ta-dialog/ta-dialog';
import { adminDashboardDataService } from '@/services/admin-dashboard/admin-dashboard-data-service';
import { User } from '../admin-dashboard/manage-project/users';

enum TabValues {
  ALL = 'all',
  OPEN = 'open',
  COMPLETE = 'complete'
}

enum IRTabsValues {
  INBOX = 'inbox',
  TASK = 'task'
}

const IRTabs = [
    { id: IRTabsValues.INBOX, label: 'Inbox', icon: 'fa-regular fa-envelope' },
    { id: IRTabsValues.TASK, label: 'Task', icon: 'fa-solid fa-list-check' }
  ];

const tabItems = [
  { value: TabValues.OPEN, label: 'Open' },
  { value: TabValues.COMPLETE, label: 'Completed' },
  { value: TabValues.ALL, label: 'All' }
];

export function InvestorRelationsRevised() {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [emailHtml, setEmailHtml] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isAiSummaryShown, setIsAiSummaryShown] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTaskOpen, setIsTaskOpen] = useState<boolean>(false);
  const [activeIRTab, setActiveIRTab] = useState<IRTabsValues>(IRTabsValues.INBOX);
  const [activeTab, setActiveTab] = useState<TabValues>(TabValues.OPEN);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const confirmActionRef = useRef<() => void>(() => {});
  const [contacts, setContacts] = useState<Recipient[]>([]);
  
  // Fixed state for thread management
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [threadMessages, setThreadMessages] = useState<Record<string, IREmailMessage[]>>({});
  const [loadingThreads, setLoadingThreads] = useState<Set<string>>(new Set());

  const createTaskRef = useRef<HTMLInputElement>(null);

  const { irEmails, inquiries, selectedIrEmail, selectedInquiry, isLoading, isIREmailLoading, hasIRAccess, setSelectedIrEmail, setSelectedInquiry, loadInquiries, loadEmails, changeStatus, updateStatusFromCompleted, checkIRAccess } = useInvestorRelationsStore();

  useEffect(() => {
    if (selectedIrEmail)
      onEmailSelection(selectedIrEmail);
  }, [selectedIrEmail]);

  useEffect(()=>{
    setThreadMessages({})
    setExpandedThreads(new Set());
  },[irEmails])

  useEffect(() => {
    checkIRAccess()
  }, [])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch users and roles in parallel with allSettled
        const response = await adminDashboardDataService.getUserList(1, 10, true);
        const contacts:Recipient[] = response?.data?.map((items: User): Recipient  => {
          return {
            name: items.full_name,
            email: items.email,
            type: 'person',
            department: items.role_name
          }
        }) || [];
        // Handle each result separately
        setContacts(contacts || []);
      } catch (error) {
        console.error('Error in fetchInitialData:', error)
      } finally { }
    }
    fetchInitialData()
  }, [])

  async function onEmailSelection(email: IREmailMessage) {
    const userContext = useUserContextStore.getState().userContext;
    const previewUserEmail = userService.getPreviewUserEmail();
    const userEmail = previewUserEmail || userContext.userInfo?.email || userContext.userId;
    
    try {
      const [emailContent, aiContent] = await Promise.all([
        investorRelationsService.getEmailContentAsHtml(email.id!, userEmail!),
        investorRelationsService.getIRSummary(email.id!, userEmail!)
      ]);

      setAiSummary(aiContent.ir_summary);
      setEmailHtml(emailContent.html_content);
      
      // Update the email object with cc_addresses if available
      if (emailContent.cc_addresses) {
        const ccRecipients = emailContent.cc_addresses.map((email: string) => ({
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email,
          type: 'person' as const
        }));
        // Update the email object without triggering a re-render
        email.cc_addresses = ccRecipients;
      }
    } catch (error) {
      console.error('Error loading email content:', error);
      toast.error('Failed to load email content');
    }
  }

  // Fixed function to handle thread expansion
  const handleThreadToggle = async (event: React.MouseEvent, conversation_id: string) => {
    event.stopPropagation();

    if (!conversation_id) {
      console.error('No conversation_id provided');
      return;
    }

    const isExpanded = expandedThreads.has(conversation_id);

    if (isExpanded) {
      // Collapse thread
      const newExpandedThreads = new Set(expandedThreads);
      newExpandedThreads.delete(conversation_id);
      setExpandedThreads(newExpandedThreads);
    } else {
      // Expand thread - fetch thread messages if not already loaded
      if (!threadMessages[conversation_id]) {
        setLoadingThreads(prev => new Set(prev).add(conversation_id));

        try {
          const userContext = useUserContextStore.getState().userContext;
          const previewUserEmail = userService.getPreviewUserEmail();
          const userEmail = previewUserEmail || userContext.userInfo?.email || userContext.userId;
          
          const threadData = await investorRelationsService.getEmailThreads(conversation_id, userEmail!);
          
          setThreadMessages(prev => ({
            ...prev,
            [conversation_id]: threadData || []
          }));
        } catch (error) {
          console.error('Error fetching thread messages:', error);
          toast.error('Failed to load thread messages');
          return;
        } finally {
          setLoadingThreads(prev => {
            const newSet = new Set(prev);
            newSet.delete(conversation_id);
            return newSet;
          });
        }
      }

      // Expand thread
      const newExpandedThreads = new Set(expandedThreads);
      newExpandedThreads.add(conversation_id);
      setExpandedThreads(newExpandedThreads);
    }
  };

  // Fixed function to render thread messages
  const renderThreadMessages = (conversation_id: string) => {
    const threads = threadMessages[conversation_id] || [];
    
    if (threads.length === 0) {
      return null;
    }
    
    return threads.map((threadMsg, threadIdx) => (
      <div
        key={`thread-${conversation_id}-${threadMsg.id || threadIdx}`}
        className={`message flex max-w-full ml-6 ${selectedIrEmail?.id === threadMsg.id ? 'selected' : ''}`}
        onClick={() => {
          setSelectedIrEmail(threadMsg);
          setSelectedInquiry(null);
        }}
        style={{ paddingLeft: '5px', marginTop: '4px' }}
      >
        <div className='flex-shrink-0 grid grid-cols-2 items-center'>
          <div className="invisible">
            <i className="fa-light fa-chevron-right"></i>
          </div>
          <div
            className={`radio-button-container flex-shrink-0 ${threadMsg.complete ? 'checked' : ''}`}
            title="Mark as Completed"
            onClick={(event) => handleEmailComplete(event, threadMsg)}
          >
            <i className="fa-solid fa-check"></i>
          </div>
        </div>

        <div className="content flex-grow max-w-[90%]">
          <div className="header">
            <span className="sender truncate flex-none max-w-[60%]">
              {threadMsg.important && <span className="priority">❗</span>}
              {threadMsg.sender}
            </span>
            <span className="time">{formatDate(threadMsg.received)}</span>
          </div>
          <div className="subject truncate max-w-[60%]">{threadMsg.subject}</div>
        </div>
      </div>
    ));
  };
  
  function showConfirmation(message: string, onConfirm: () => void) {
    setConfirmationMessage(message);
    confirmActionRef.current = onConfirm;
    setIsConfirmationOpen(true);
  }

  function handleEmailComplete(event: any, irEmail: IREmailMessage) {
    event.stopPropagation();

    const status = irEmail.complete ? 'open' : 'completed';

    showConfirmation(`Are you sure you want to mark this email as ${status}?`, async () => {
      try {
        setIsSaving(true);
        const userContext = useUserContextStore.getState().userContext;
        const previewUserEmail = userService.getPreviewUserEmail();
        const userEmail = previewUserEmail ?? userContext?.userId;
        await investorRelationsService.markIrEmailAsComplete(irEmail.id!, userEmail!);
        await loadEmails();
        toast.success(`Email marked as ${status}`);
      } catch (error) {
        console.error('Error marking email as complete:', error);
        toast.error(`Error while trying to mark the email as ${status}`);
      } finally {
        setIsSaving(false);
      }
    });
  }

  function handleInquiryComplete(event: any, inquiry: InquiryRequest) {
    event.stopPropagation();

    const status = inquiry.status === InquiryStatus.Completed ? 'open' : 'completed';

    showConfirmation(`Are you sure you want to mark this task as ${status}?`, async () => {
      try {
        setIsSaving(true);
        inquiry.completed = inquiry.status === InquiryStatus.Completed ? false : true;
        updateStatusFromCompleted(inquiry);
        await changeStatus(inquiry.id!, inquiry.status!);
        toast.success(`Task marked as ${status}`);
      } catch (error) {
        console.error('Error marking task as complete:', error);
        toast.error(`Error while trying to mark the task as ${status}`);
      } finally {
        setIsSaving(false);
      }
    });
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
    <div className={`${styles['investor-relations']} grid gap-2 md:grid-cols-6 max-md:grid-cols-1`}>
      <div className={`${styles['ir-requests']} md:col-span-2`}>
        {hasIRAccess && <div className={styles['title']}>
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
              assignee={selectedInquiry?.assignee_email}
              isReadOnly={!!selectedInquiry}
              onClose={() => { setSelectedInquiry(null); setIsTaskOpen(false); }}>
            </RequestFormPopup>
          }

        </div>}

        <div className={styles['search-box']}>
          <input
            type='text'
            className='mb-2'
            autoFocus={true}
            autoComplete='on'
            placeholder='Filter IR Requests By Subject or Email'
            onChange={event => setSearchQuery(event.target.value)}
            value={searchQuery}
          />
          {searchQuery ?
            <i className='fa-solid fa-remove' onClick={() => { setSearchQuery(''); }}></i> :
            <i className='fa-solid fa-magnifying-glass'></i>}
        </div>
        
        <div className={styles['mail-inbox']}>
           <div className="bg-[#0b6157] rounded-lg p-1 shadow-lg mb-2 w-max">
            <div className="flex space-x-1">
              {IRTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveIRTab(tab.id)}
                  className={`px-4 py-1 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 ${activeIRTab === tab.id
                      ? 'bg-white text-[#0b6157] shadow-sm'
                      : 'text-white hover:bg-white hover:bg-opacity-50'
                    }`}
                >
                  <i className={tab.icon}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Tabs.Root
              className="flex w-full h-full flex-col rounded-md overflow-hidden"
              defaultValue={TabValues.OPEN}
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as TabValues)}
            >
              <Tabs.List className="flex" aria-label="Manage your project">
                {tabItems.map((tab) => (
                  <Tabs.Trigger
                    key={tab.value}
                    className="flex h-12 flex-1 cursor-pointer select-none items-center justify-center px-5 text-base font-medium text-gray-200 outline-none relative hover:text-teal-400 data-[state=active]:text-teal-400 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value={tab.value}
                  >
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <Tabs.Content value={activeTab} className="grow mt-2">
                <div className={`${styles['messages']} message-list scrollable-div w-full`}>
                  {(() => {
                    const filteredEmails = irEmails
                      .filter((msg) => {
                        switch (activeTab) {
                          case TabValues.OPEN:
                            return !msg.complete;
                          case TabValues.COMPLETE:
                            return msg.complete;
                          default:
                            return true;
                        }
                      })
                      .filter((msg) =>
                        (!searchQuery || msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) || msg.sender.toLowerCase().includes(searchQuery.toLowerCase()))
                      );

                    const filteredInquiries = inquiries
                      .filter((msg) => {
                        switch (activeTab) {
                          case TabValues.OPEN:
                            return msg.status !== InquiryStatus.Completed;
                          case TabValues.COMPLETE:
                            return msg.status === InquiryStatus.Completed;
                          default:
                            return true;
                        }
                      })
                      .filter((msg) =>
                        !searchQuery || msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || msg?.assignee_email?.toLowerCase().includes(searchQuery.toLowerCase()) || msg?.owner_email?.toLowerCase().includes(searchQuery.toLowerCase())
                      );

                    if (filteredEmails.length === 0 && filteredInquiries.length === 0) {
                      return (
                        <div className='w-full flex justify-center items-center h-20'>
                          {
                            isIREmailLoading ? (<Spinner size={"3"} />) : (<div className="flex items-center justify-center p-4 text-gray-400">
                              No data found
                            </div>)
                          }
                        </div>
                      );
                    }

                    return (
                      <>
                        {activeIRTab === IRTabsValues.INBOX && filteredEmails.map((msg, idx) => (
                          <div key={msg.id || idx}>
                            {/* Main Email Message */}
                            <div
                              className={`message flex max-w-full ${selectedIrEmail?.id === msg.id ? 'selected' : ''}`}
                              onClick={() => {
                                setSelectedIrEmail(msg);
                                setSelectedInquiry(null);
                              }}
                            >
                              <div className='flex-shrink-0 grid grid-cols-2 items-center'>
                                <div 
                                  className={`${msg.threadflag ? 'visible' : 'invisible'} cursor-pointer`}
                                  onClick={(event) => handleThreadToggle(event, msg.conversation_id!)}
                                >
                                  {loadingThreads.has(msg.conversation_id!) ? (
                                    <Spinner size="1" />
                                  ) : (
                                    <i 
                                      className={`fa-light fa-chevron-right transition-transform duration-200 ${
                                        expandedThreads.has(msg.conversation_id!) ? 'rotate-90' : ''
                                      }`}
                                    ></i>
                                  )}
                                </div>
                                <div
                                  className={`radio-button-container flex-shrink-0 ${msg.complete ? 'checked' : ''}`}
                                  title="Mark as Completed"
                                  onClick={(event) => handleEmailComplete(event, msg)}
                                >
                                  <i className="fa-solid fa-check"></i>
                                </div>
                              </div>

                              <div className="content flex-grow max-w-[90%]">
                                <div className="header">
                                  <span className="sender truncate flex-none max-w-[60%]">
                                    {msg.important && <span className="priority">❗</span>}
                                    {msg.sender}
                                  </span>
                                  <span className="time">{formatDate(msg.received)}</span>
                                </div>
                                <div className="subject truncate max-w-[60%]">{msg.subject}</div>
                              </div>
                            </div>
                            
                            {/* Thread Messages - Render if expanded */}
                            {expandedThreads.has(msg.conversation_id!) && renderThreadMessages(msg.conversation_id!)}
                          </div>
                        ))}

                        {activeIRTab === IRTabsValues.TASK && filteredInquiries.map((msg, idx) => (
                          <div
                            key={msg.id || idx}
                            className={`message flex max-w-full ${selectedInquiry?.id === msg.id ? 'selected' : ''
                              }`}
                            onClick={() => {
                              setSelectedIrEmail(null);
                              setSelectedInquiry(msg);
                            }}
                          >
                            <div
                              className={`radio-button-container flex-shrink-0 ${msg.status === InquiryStatus.Completed ? 'checked' : ''
                                }`}
                              title="Mark as Completed"
                              onClick={(event) => handleInquiryComplete(event, msg)}
                            >
                              <i className="fa-solid fa-check"></i>
                            </div>

                            <div className="content flex-grow max-w-[90%]">
                              <div className="header">
                                <span className="sender truncate flex-none max-w-[60%]">
                                  {msg.flag === InquiryFlag.Urgent && (
                                    <span className="priority">❗</span>
                                  )}
                                  {msg.owner_email}
                                </span>
                                <span className="time">{formatDate(msg.date)}</span>
                              </div>

                              <div className="subject truncate max-w-[60%]">
                                {msg.subject}
                              </div>

                              <div className="body">
                                <div className="body-content-left">
                                  <span>Assignee: {msg.assignee_email}</span>
                                  <span>Due Date: {formatDate(msg.due_date)}</span>
                                </div>

                                <div className="body-content-right">
                                  <div className="pill teal">TASK</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </Tabs.Content>
            </Tabs.Root>

          </div>
        </div>
      </div>

      {
        selectedIrEmail &&
        <div className={`${styles['ir-responses']} md:col-span-4`}>
           <EmailAction
          selectedIrEmail={selectedIrEmail}
          contacts={contacts}
        />
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
          <div className='font-bold text-xl'>Task Summary</div>
          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Subject:</span> {selectedInquiry?.subject}
          </div>

          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Assigned By:</span> {selectedInquiry?.owner_email}
          </div>

          <div className={styles['inquiry-field']}>
            <span className={styles['label']}>Assignee:</span> {selectedInquiry?.assignee_email}
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

      <TaDialog
        title="Confirmation"
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
      >
        <div className="w-full">
          <label>{confirmationMessage}</label>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button onClick={() => setIsConfirmationOpen(false)} size="3" color="gray">
              Cancel
            </Button>
            <Button
              onClick={() => {
                confirmActionRef.current();
                setIsConfirmationOpen(false);
              }}
              size="3"
              color="teal"
            >
              Yes
            </Button>
          </div>
        </div>
      </TaDialog>

    </div>
  );
}