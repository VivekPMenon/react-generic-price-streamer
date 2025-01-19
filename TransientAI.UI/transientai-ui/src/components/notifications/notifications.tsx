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
            <span className={styles.name}>BA 2.8 03/01/2027</span>
            <span className={styles['notification-count']}>(6)</span>

            <div className={styles['notification-menu']}>
              <div className='pill blue'>
                AXES
              </div>

              <i className='fa-solid fa-ellipsis ml-3'></i>
            </div>
          </div>

          <div className={styles['notification-content']}>
            <div className='blue-color'>$10MM at 92.75 (+215bp)</div>
            <div className={styles['messages']}>
              <ul className="list-disc pl-5 off-white-color">
                <li>Corporate funds shun Boeing short dated bonds despite record purchases of short end IG and UST paper</li>
                <li>Orders of Airbus 318 surprisingly grow faster than expected </li>
                <li>Technical support at current levels</li>
                <li>Fourth sentence in the list</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles['notification-item']}>
          <div className={styles['notification-title']}>
            <i className='fa-solid fa-ban'></i>
            <span className={styles.name}>KR 5 09/15/2034</span>
            <span className={styles['notification-count']}>(6)</span>

            <div className={styles['notification-menu']}>
              <div className='pill blue'>
                AXES
              </div>

              <i className='fa-solid fa-ellipsis ml-3'></i>
            </div>
          </div>

          <div className={styles['notification-content']}>
            <div className='blue-color'>$10MM at 92.75 (+215bp)</div>
            <div className={styles['messages']}>
              <ul className="list-disc pl-5 off-white-color">
                <li>Expected gross margin improvement with latest PPI report indicating lower food input costs</li>
                <li>Partnership with Ocado's automated solutions yielding results as online orders grow with return to office drive</li>
              </ul>
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