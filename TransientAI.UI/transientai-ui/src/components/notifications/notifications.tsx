import styles from './notifications.module.scss';

export function Notifications() {
  return (
    <div className={`${styles.notifications} widget`}>
      Notifications

      <div className='filters'>
        <button className='filter active'>All</button>
        <button className='filter'>Axes</button>
        <button className='filter'>Clients</button>
        <button className='filter'>Trades</button>
        <button className='filter'>News</button>
      </div>

      <div className={styles['notification-items']}>

        <div className={styles['notification-item']}>
          <div className={styles['notification-title']}>
            <i className='fa-solid fa-ban'></i>
            <span className={styles.name}>AXES 12/12/24</span>
            <span className={styles['notification-count']}>(6)</span>

            <div className={styles['notification-menu']}>
              <div className='pill blue'>
                AXES
              </div>

              <i className='fa-solid fa-ellipsis ml-3'></i>
            </div>
          </div>
        </div>

        <div className={styles['notification-item']}>
          <div className={styles['notification-title']}>
            <i className='fa-solid fa-newspaper'></i>
            <span className={styles.name}>NEWS FEED 11/12/24</span>
            <span className={styles['notification-count']}>(6)</span>

            <div className={styles['notification-menu']}>
              <div className='pill pink'>
                NEWS
              </div>

              <i className='fa-solid fa-ellipsis ml-3'></i>
            </div>
          </div>
        </div>

        <div className={styles['notification-item']}>
          <div className={styles['notification-title']}>
            <i className='fa-solid fa-user'></i>
            <span className={styles.name}>CLIENT REMINDER</span>
            <span className={styles['notification-count']}>(6)</span>

            <div className={styles['notification-menu']}>
              <div className='pill orange'>
                CLIENTS
              </div>

              <i className='fa-solid fa-ellipsis ml-3'></i>
            </div>
          </div>
        </div>

        <div className={styles['notification-item']}>
          <div className={styles['notification-title']}>
            <i className='fa-solid fa-newspaper'></i>
            <span className={styles.name}>NEWS FEED 11/12/24</span>
            <span className={styles['notification-count']}>(6)</span>

            <div className={styles['notification-menu']}>
              <div className='pill pink'>
                NEWS
              </div>

              <i className='fa-solid fa-ellipsis ml-3'></i>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}