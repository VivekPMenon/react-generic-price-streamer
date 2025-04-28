import {create} from 'zustand';
import {MenuInfo} from './model';
import {getMenuItems, Mode} from './menu-data-service';

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
    .find(menuInfo => menuInfo.id === defaultMenuId)!;
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

export const useMenuStore = create<MenuState>((set) => ({
  activeMenuList: [],
  fullMenuList: [],
  selectedMenu: [],
  defaultMenu: [],

  initializeMenus: (mode: Mode, userRole: string) => {
    const menuInfoList = getMenuItems(mode, userRole);

    const defaultMenuId = mode === Mode.BUY 
    ? (menuInfoList.some(menu => menu.id === 'hurricane-pms') ? 'hurricane-pms' : 'macro-panel') 
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
      const isExisting = state.activeMenuList.some((m) => m.id === menu.id);
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