'use client'

import { Mode, menuStore } from '@/services/menu-data'
import styles from './explorer.module.scss'
import { useEffect } from 'react'
import MenuList from '../menu/menu-list'
export interface ExplorerProps {
  onExpandCollapse?: (state: boolean) => void
  onNavigate?: () => void
  mode: Mode
}

export function Explorer (props: ExplorerProps) {
  const initializeMenus = menuStore.use.initializeMenus();
  const fullMenuList = menuStore.use.fullMenuList();
  const isLoading = menuStore.use.isLoading();

  useEffect(() => {
    initializeMenus(props.mode)
  }, [initializeMenus, props.mode])

  return (
    <div className={`${styles.explorer} widget`}>
      <div className='widget-title'>Explorer</div>
      <MenuList
        menuList={fullMenuList}
        isLoading={isLoading}
        onNavigate={props.onNavigate}
      />
    </div>
  )
}
