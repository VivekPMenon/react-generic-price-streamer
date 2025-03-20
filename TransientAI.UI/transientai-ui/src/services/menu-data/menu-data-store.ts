import { create } from 'zustand';
import { MenuInfo } from './model';
import { menuInfoList } from './menu-data-service';

interface MenuState {
  activeMenuList: MenuInfo[];
  fullMenuList: MenuInfo[];
  selectedMenu: MenuInfo | null;
  defaultMenu: MenuInfo;
  setActiveMenu: (menu: MenuInfo) => void;
  closeTab: (menuId: string) => void;
}

function calculateDefaultMenu() {
  return menuInfoList
    .find(menuInfo => menuInfo.description === 'Research Reports')!;
}

function calculateCurrentMenu() {
  if (typeof window === 'undefined') {
    return {};
  }
  return menuInfoList
    .find(menuInfo => menuInfo.route?.toLowerCase() === window.document.location.pathname?.toLowerCase())!;
}

function calculateActiveMenuList() {
  const currentMenu = calculateCurrentMenu();
  const defaultMenu = calculateDefaultMenu();
  return currentMenu === defaultMenu ? [defaultMenu] : [defaultMenu, currentMenu];
}

export const useMenuStore = create<MenuState>((set) => ({
  activeMenuList: calculateActiveMenuList(),
  fullMenuList: menuInfoList,
  selectedMenu: calculateCurrentMenu()!,
  defaultMenu: calculateDefaultMenu(),

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
