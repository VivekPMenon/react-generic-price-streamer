import {create} from 'zustand';
import {MenuInfo} from './model';
import {getMenuItems, Mode} from './menu-data-service';
import { createSelectors } from '@/lib/utility-functions/store-operations';

interface MenuState {
  activeMenuList: MenuInfo[];
  fullMenuList: MenuInfo[];
  selectedMenu: MenuInfo | null;
  defaultMenu: MenuInfo;
  setActiveMenu: (menu: MenuInfo) => void;
  closeTab: (menuId: string) => void;
  initializeMenus: (mode: Mode, userRole: string) => void;
}

function calculateDefaultMenu(menuInfoList: MenuInfo[], defaultMenuId: string) {
  return menuInfoList
    .find(menuInfo => menuInfo.key === defaultMenuId) || menuInfoList[0];
}

function calculateCurrentMenu(menuInfoList: MenuInfo[]) {
  if (typeof window === 'undefined') {
    return {};
  }
  return menuInfoList
    .find(menuInfo => menuInfo.route?.toLowerCase() === window.document.location.pathname?.toLowerCase())!;
}

function calculateActiveMenuList(menuInfoList: MenuInfo[], defaultMenuId: string) {
  const currentMenu = calculateCurrentMenu(menuInfoList);
  const defaultMenu = calculateDefaultMenu(menuInfoList, defaultMenuId);
  const menuItems = currentMenu === defaultMenu ? [defaultMenu] : [defaultMenu, currentMenu];
  return menuItems.filter(menu => menu !== undefined);
}

const useMenuStore = create<MenuState>((set) => ({
  activeMenuList: [],
  fullMenuList: [],
  selectedMenu: [],
  defaultMenu: [],

  initializeMenus: async (mode: Mode, userRole: string) => {
    const menuInfoList = await getMenuItems(mode);

    const defaultMenuId = mode === Mode.BUY 
    ? (menuInfoList.some((menu) => menu.key === 'hurricane-pms') ? 'hurricane-pms' : 'macro-panel') 
    : 'todays-axes';

    set({
        activeMenuList: calculateActiveMenuList(menuInfoList, defaultMenuId),
        fullMenuList: menuInfoList,
        selectedMenu: calculateCurrentMenu(menuInfoList)!,
        defaultMenu: calculateDefaultMenu(menuInfoList, defaultMenuId)
    })
  },

  setActiveMenu: (menu) =>
    set((state) => {
      const isExisting = state.activeMenuList.some((m) => m.key === menu.key);
      const updatedMenuList = isExisting
        ? state.activeMenuList
        : [...state.activeMenuList, menu];

      return {
        activeMenuList: updatedMenuList,
        selectedMenu: menu,
      };
    }),

  closeTab: (menuId) =>
    set((state) => {
      const updatedMenuList = state.activeMenuList.filter((m) => m.id !== menuId);
      const newSelectedMenu =
        state.selectedMenu?.id === menuId
          ? updatedMenuList[0] || null
          : state.selectedMenu;

      return {
        activeMenuList: updatedMenuList,
        selectedMenu: newSelectedMenu,
      };
    }),
}));

export const menuStore = createSelectors(useMenuStore);