'use client'

import { Header } from '@/components/header/header'
import { useEffect, useState } from 'react'
import { useDeviceType } from '@/lib/hooks'
import { useUserContextStore } from '@/services/user-context'
import { MsalProvider } from '@azure/msal-react'
import { Spinner } from '@radix-ui/themes'
import { AdminMenuList, menuStore } from '@/services/menu-data'

import msalInstance from '../msal-config'
import styles from './layout.module.scss'
import 'react-tooltip/dist/react-tooltip.css'
import { MenuList } from '@/components/menu/menu-list'
import { useRouter } from 'next/navigation'

export default function AdminDashboardLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // todo.. unable to add this to the root of the app, as it is server side rendered, create an intermediate layout that wil act as root for all client dashboards
  const { loadUserContext, isLoading, isAuthenticated, userContext } =
    useUserContextStore()
  const [hurricanePmsView, setHurricanePmsView] = useState<boolean | null>(null)
  const selectedMenu = menuStore.use.selectedMenu()
  const router = useRouter()

  useEffect(() => {
    loadUserContext()
  }, [])

  useEffect(() => {
    setHurricanePmsView(selectedMenu?.key === 'hurricane-pms')
  }, [selectedMenu])

  const deviceType = useDeviceType()

  const [expandedPanels, setExpandedPanels] = useState<string[]>([])
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true)

  function onMenuToggle () {
    setIsMenuVisible(!isMenuVisible)
  }

  if (!userContext?.userInfo?.superadmin) {
    return (
      <div className='w-screen h-screen flex items-center justify-center'>
        <span>404 Unauthorized</span>
      </div>
    )
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
              className={`widget ${styles['left-panel']} ${
                !isMenuVisible && deviceType === 'mobile'
                  ? styles['collapsed']
                  : ''
              } ${hurricanePmsView && '!max-w-32'} transition-all duration-300`}
            >
              {!expandedPanels.includes('notifications') ? (
                <MenuList
                  menuList={AdminMenuList}
                  onNavigate={() => setIsMenuVisible(false)}
                />
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
