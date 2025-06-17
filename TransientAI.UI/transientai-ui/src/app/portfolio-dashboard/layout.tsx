import styles from './layout.module.scss';
import { OrderDetails } from './order-details';
import { OrderQueryTool } from './order-query-tool';
import { StpFeeds } from './stp-feed';

export default function Layout() {
  return (
    <div className={styles['portfolio-dashboard']}>
      <div className={styles['header']}>

      </div>

      <div className={styles['nav-and-content']}>
        <div className={styles['side-nav']}>

          <div className={styles['primary-nav']}>
            <div className={styles['title']} >
              <img src="/images/TRANS_H_white-on-transparent.png" />
            </div>
            <div className={styles['nav-item']}>
              <i className='fa-thin fa-home'></i>
            </div>
            <div className={`${styles['nav-item']} ${styles['active']}`}>
              <i className='fa-thin fa-desktop'></i>
            </div>
            <div className={`${styles['nav-item']}`}>
              <i className='fa-thin fa-bars-staggered'></i>
            </div>
            <div className={`${styles['nav-item']}`}>
              <i className='fa-thin fa-briefcase'></i>
            </div>
          </div>

          <div className={styles['fixed-nav']}>
            <div className={`${styles['profile-pic']} profile-pic`}>
              <img src="/images/ProfilePicAI.png" alt='profile'></img>
            </div>
            <div className={styles['nav-item']}>
              <i className='fa-thin fa-gear'></i>
            </div>
          </div>

        </div>

        <div className={styles['main-content']}>
          <div className={styles['top-content']}>
            <div className='flex-[1_1_75%]'>
              <StpFeeds></StpFeeds>
            </div>
            <div className='flex-[1_1_25%]'>
              <OrderDetails></OrderDetails>
            </div>

          </div>

          <div className={styles['middle-content']}>
            <OrderQueryTool></OrderQueryTool>
          </div>

          {/* <div className={styles['bottom-content']}>
            <div className='widget height-100p'>
              <div className='widget-title'>Placeholder 1</div>
            </div>
          </div> */}
        </div>

      </div>
    </div>
  )
} 