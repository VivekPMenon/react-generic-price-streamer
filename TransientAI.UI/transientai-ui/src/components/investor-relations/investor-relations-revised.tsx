
import { useState } from 'react';
import styles from './investor-relations-revised.module.scss';
import { Spinner } from '@radix-ui/themes';
import { InquiryRequest } from '@/services/investor-relations-data';

export function InvestorRelationsRevised() {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [emails, setEmails] = useState<InquiryRequest[]>([{
    subject: 'Test Me',
    assignee_name: 'Vivek Menon'
  },
  {
    subject: 'Test Me',
    assignee_name: 'ViGovvek Menon'
  }]);

  const messages = [
    {
      sender: 'David Kim via Otter.ai',
      subject: 'Reminder: David Kim has invited …',
      time: 'Fri 12:03 PM',
      content: 'Join thetransient.ai David Kim (davidk@thetransient.ai)…',
      selected: true,
    },
    {
      sender: 'Linear',
      subject: 'davidk@thetransient.ai commented o…',
      time: 'Thu 5/1',
      content: 'You have 1 unread notification on Linear. Open …',
      selected: false,
    },
    {
      sender: 'Linear',
      subject: 'davidk@thetransient.ai commented …',
      time: 'Thu 5/1',
      content: 'You have 1 unread notification on Linear. Open …',
      selected: false,
    },
  ];

  return (
    <div className={styles['investor-relations']}>
      <div className={styles['ir-requests']}>
        <div className={styles['title']}>
          IR Requests
          <i className='fa-regular fa-pen-to-square'></i>
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
            <div className='action-button bg-outlook-blue'>
              <i className='fa-regular fa-envelope'></i>
            </div>
            Inbox
          </div>


          <div className='bg-[#0d1117] text-white rounded-md overflow-hidden divide-y divide-gray-700'>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col px-4 py-3 cursor-pointer ${msg.selected ? 'bg-[#0078D4]/20 border-l-4 border-[#0078D4]' : 'hover:bg-white/5'
                  }`}
              >
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{msg.sender}</span>
                  <span className='text-xs text-gray-400'>{msg.time}</span>
                </div>
                <div className='text-sm text-gray-200 truncate'>{msg.subject}</div>
                <div className='text-xs text-gray-500 truncate'>{msg.content}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className={styles['ir-responses']}>
        IR Responses
      </div>

    </div>
  );
}