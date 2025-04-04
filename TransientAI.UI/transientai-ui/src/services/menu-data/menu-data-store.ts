import { create } from 'zustand';
import { MenuInfo } from './model';
import {getMenuItems, Mode} from './menu-data-service';

interface MenuState {
  activeMenuList: MenuInfo[];
  fullMenuList: MenuInfo[];
  selectedMenu: MenuInfo | null;
  defaultMenu: MenuInfo;
  setActiveMenu: (menu: MenuInfo) => void;
  closeTab: (menuId: string) => void;
  initializeMenus: (mode: Mode) => void;
}

function calculateDefaultMenu(menuInfoList: MenuInfo[]) {
  return menuInfoList
    .find(menuInfo => menuInfo.id === 'research-reports')!;
}

function calculateCurrentMenu(menuInfoList: MenuInfo[]) {
  if (typeof window === 'undefined') {
    return {};
  }
  return menuInfoList
    .find(menuInfo => menuInfo.route?.toLowerCase() === window.document.location.pathname?.toLowerCase())!;
}

function calculateActiveMenuList(menuInfoList: MenuInfo[]) {
  const currentMenu = calculateCurrentMenu(menuInfoList);
  const defaultMenu = calculateDefaultMenu(menuInfoList);
  return currentMenu === defaultMenu ? [defaultMenu] : [defaultMenu, currentMenu];
}

export const useMenuStore = create<MenuState>((set) => ({
  activeMenuList: [],
  fullMenuList: [],
  selectedMenu: [],
  defaultMenu: [],

  initializeMenus: (mode: Mode) => {
      const menuInfoList = getMenuItems(mode);
        set({
            activeMenuList: calculateActiveMenuList(menuInfoList),
            fullMenuList: menuInfoList,
            selectedMenu: calculateCurrentMenu(menuInfoList)!,
            defaultMenu: calculateDefaultMenu(menuInfoList)
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
