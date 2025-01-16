'use client';

import { useState } from 'react';
import styles from './chatbot.module.scss';
import { ChatbotResponse } from './chatbot-response';

export function Chatbot() {

  const [isResponseShown, setIsResponseShown] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const pastQueries = [
    'Recommended bond sales, Monday 12/19/24',
    'BlackRock portfolio analysis & recommendations',
    'S&P 500 sector rotation strategy'
  ];

  function onKeyDown(event: any) {
    if (event.key !== "Enter") {
      return;
    }

    const inputValue = event.target.value;
    setQuery(inputValue);
    setIsResponseShown(true);
  }

  function selectPastQuery(pastQuery: string) {
    setQuery(pastQuery);
    setIsResponseShown(true);
  }


  if (isResponseShown) {
    return <div className={styles['chatbot-container']}>
      <ChatbotResponse
        query={query}
        navigateBack={() => setIsResponseShown(false)}>
      </ChatbotResponse>
    </div>;
  }

  return (
    <div className={styles['chatbot-container']}>
      <div className={styles['chatbot-header']}>
        <h1>Trade with TransientAI</h1>
        <p>Start a new chat or make edits to an existing workflow below</p>
      </div>

      <div className={styles['search-bar']} >
        <input type="text" placeholder="Ask TransientAI anything - use '@' to find files, folders and other trading data" onKeyDown={onKeyDown} />
      </div>

      <div className={styles['workflow-list']}>
        <h2>Past chats & workflows</h2>
        {
          pastQueries.map(pastQuery => (
            <div className={styles['workflow-item']} onClick={() => selectPastQuery(pastQuery)} key={pastQuery}>
              <p>{pastQuery}</p>
              <span>2 days</span>
            </div>
          ))
        }

        <button className='hyperlink primary'>Show more</button>
      </div>
    </div>
  );
}