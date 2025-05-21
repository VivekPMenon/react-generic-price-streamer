import { MenuInfo, menuStore } from '@/services/menu-data'
import { Skeleton } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import React from 'react'

interface MenuListProps {
  menuList: MenuInfo[]
  isLoading?: boolean
  onNavigate?: () => void
}
const hurricanePmsView = 'hurricane-pms'

export function MenuList ({
  menuList,
  isLoading = false,
  onNavigate
}: MenuListProps) {
  const selectedMenu = menuStore.use.selectedMenu()
  const setActiveMenu = menuStore.use.setActiveMenu()
  const router = useRouter()

  function onMenuClick (selectedMenuInfo: MenuInfo) {
    setActiveMenu(selectedMenuInfo)
    router.push(selectedMenuInfo.route || '/')
    onNavigate?.()
  }

  return (
    <div className='widget h-full'>
      <div className='menu'>
        {isLoading ? (
          <div className='w-full gap-4 grid grid-cols-1 justify-center p-4'>
            {Array(7)
              .fill('')
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={'20px'}
                  width={`${i % 2 == 0 ? '100%' : '75%'}`}
                />
              ))}
          </div>
        ) : menuList.length > 0 ? (
          menuList.map(menuInfo => (
            <div className='menu-item' key={menuInfo.id}>
              <div
                className={`parent-menu ${
                  menuInfo.id === selectedMenu?.id ? 'active' : ''
                }`}
                onClick={() => onMenuClick(menuInfo)}
              >
                <span className={`icon ${menuInfo.icon}`}></span>
                {selectedMenu?.key !== hurricanePmsView && (
                  <span className='text'>{menuInfo.description}</span>
                )}
                {menuInfo.badgeCount && menuInfo.badgeCount > 0 && (
                  <span className='badge'>{menuInfo.badgeCount}</span>
                )}
              </div>

              {menuInfo.children &&
                menuInfo.children.map(childMenu => (
                  <div className='submenu' key={childMenu.id}>
                    <div
                      className='submenu-item'
                      onClick={() => onMenuClick(childMenu)}
                    >
                      {childMenu.description}
                      <span className='timestamp'>
                        {childMenu.subDescription}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ))
        ) : (
          <div className='text-center'>No menu items found.</div>
        )}
      </div>
    </div>
  )
}

export default MenuList
