import styles from './explorer.module.scss';

export function Explorer() {
  return (
    <div className={styles.explorer}>
      Explorer

      <div className="menu">
        <div className="menu-item">
          <div className='parent-menu'>
            <span className="icon fa-solid fa-user"></span>
            <span className="text">Today</span>
            <span className="badge">5</span>
          </div>
        </div>

        <div className="menu-item collapsible">
          <div className='parent-menu'>
            <span className="icon">📂</span>
            <span className="text">Client Activity</span>
            <span className="badge">4</span>
          </div>
          <div className="submenu">
            <div className="submenu-item">Active Orders</div>
            <div className="submenu-item">Recent Trades</div>
            <div className="submenu-item">Call Notes</div>
            <div className="submenu-item">Position Changes <span className="timestamp">11/24 9:45am</span></div>
          </div>
        </div>

        <div className="menu-item collapsible">
          <div className='parent-menu'>
            <span className="icon">📘</span>
            <span className="text">Client Books</span>
            <span className="badge">4</span>
          </div>
        </div>

        <div className="menu-item collapsible">
          <div className='parent-menu'>
            <span className="icon">📊</span>
            <span className="text">Market Analysis</span>
          </div>
          <div className="submenu">
            <div className="submenu-item">Breaking News <span className="timestamp">11/24 11:15am</span></div>
            <div className="submenu-item">Earnings Updates</div>
            <div className="submenu-item">Rating Changes</div>
            <div className="submenu-item">Research Notes <span className="timestamp">11/24 8:45am</span></div>
          </div>
        </div>
      </div>

    </div>
  )
}