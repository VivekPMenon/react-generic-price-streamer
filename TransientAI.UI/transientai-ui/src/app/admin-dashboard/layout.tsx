'use client'

import { Explorer } from '@/components/explorer/explorer'
import { Header } from '@/components/header/header'
import { useEffect, useState } from 'react'
import { useDeviceType } from '@/lib/hooks'
import { useUserContextStore } from '@/services/user-context'
import { MsalProvider } from '@azure/msal-react'
import { Spinner } from '@radix-ui/themes'
import { AdminMenuList, Mode, menuStore } from '@/services/menu-data'
import { ServiceInitializer } from '@/services/startup/initializer'

import msalInstance from '../msal-config'
import styles from './layout.module.scss'
import 'react-tooltip/dist/react-tooltip.css'
import { MenuList } from '@/components/menu/menu-list'

const MODE: Mode = Mode.BUY

const serviceInitializer = new ServiceInitializer(MODE)

export default function AdminDashboardLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // todo.. unable to add this to the root of the app, as it is server side rendered, create an intermediate layout that wil act as root for all client dashboards
  const { loadUserContext, isLoading, isAuthenticated } = useUserContextStore()
  const [hurricanePmsView, setHurricanePmsView] = useState<boolean | null>(null)
  const selectedMenu = menuStore.use.selectedMenu()

  useEffect(() => {
    loadUserContext()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      window.history.replaceState({}, document.title, window.location.pathname)
      serviceInitializer.initialize()
    }
  }, [isAuthenticated])

  useEffect(() => {
    setHurricanePmsView(selectedMenu?.key === 'hurricane-pms')
  }, [selectedMenu])

  const deviceType = useDeviceType()

  const [expandedPanels, setExpandedPanels] = useState<string[]>([])
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true)

  function onExpandCollapse (panelName: string, isExpanded: boolean) {
    const latestExpandedPanels = [...expandedPanels]

    if (isExpanded) {
      latestExpandedPanels.push(panelName)
    } else {
      const index = latestExpandedPanels.findIndex(panel => panel === panelName)
      latestExpandedPanels.splice(index, 1)
    }

    setExpandedPanels(latestExpandedPanels)
  }

  function onMenuToggle () {
    setIsMenuVisible(!isMenuVisible)
  }

  return (
    <MsalProvider instance={msalInstance}>
      {isLoading || !isAuthenticated ? (
        <div className='p-2 flex gap-2 items-center justify-center height-100p'>
          <Spinner size={'3'}></Spinner>
          Trying to authenticate you. Please wait...
        </div>
      ) : (
        <div className={styles.home}>
          <Header
            isMenuVisible={isMenuVisible}
            onMenuToggle={onMenuToggle}
          ></Header>

          <main>
            <div
              className={`${styles['left-panel']} ${
                !isMenuVisible && deviceType === 'mobile'
                  ? styles['collapsed']
                  : ''
              } ${hurricanePmsView && '!max-w-32'} transition-all duration-300`}
            >
              {!expandedPanels.includes('notifications') ? (
                    <MenuList menuList={AdminMenuList} onNavigate={()=> setIsMenuVisible(false)}/>
                // <Explorer
                //   mode={MODE}
                //   onExpandCollapse={isExpanded =>
                //     onExpandCollapse('explorer', isExpanded)
                //   }
                //   onNavigate={() => setIsMenuVisible(false)}
                // ></Explorer>
              ) : (
                <></>
              )}
            </div>

            <div
              className={`widget ${styles['middle-panel']} ${
                isMenuVisible && deviceType === 'mobile'
                  ? styles['collapsed']
                  : ''
              }`}
            >
             {children}
            </div>
          </main>
        </div>
      )}
    </MsalProvider>
  )
}

