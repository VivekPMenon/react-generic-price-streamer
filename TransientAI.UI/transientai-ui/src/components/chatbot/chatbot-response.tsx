import styles from './chatbot-response.module.scss';

export function ChatbotResponse() {
  return (
    <div className={styles['chatbot-response']}>
      <button className='hyperlink'>Back to List</button>

      <div className={styles['chat-message']}>
        <div className={styles['message-content']}>
          <div className={styles['message-header'] + ' profile-pic'}>VM</div>
          <p>Can you analyze the top performing tech sector bonds and provide recommendations for sales?</p>
        </div>

        <div className={styles['message-time']}>10:33 AM</div>
      </div>

      <div className={`${styles['chat-message']}}`}>
        <div className={styles['assistant']}>
          <p>
            I’ve analyzed the tech sector bonds and here are the top recommendations based on current market conditions and client preferences:
          </p>
          <div className={styles['recommendation-card']}>
            <div className={styles['recommendation-icon']}>✅</div>
            <div className={styles['recommendation-text']}>Tech Sector Bond Recommendations</div>
          </div>
        </div>

        <div className={styles['message-time']}>10:33 AM</div>
      </div>
    </div>
  );
}