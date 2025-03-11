import { create } from 'zustand';
import { MenuInfo } from './model';
import { menuInfoList } from './menu-data';

interface MenuState {
  activeMenuList: MenuInfo[];
  fullMenuList: MenuInfo[];
  selectedMenu: MenuInfo | null;
  setActiveMenu: (menu: MenuInfo) => void;
  closeTab: (menuId: string) => void;
}

const defaultTab = menuInfoList.find(menu => menu.description === "Research Reports");

export const useMenuStore = create<MenuState>((set) => ({
  activeMenuList: defaultTab ? [defaultTab] : [],
  fullMenuList: menuInfoList,
  selectedMenu: defaultTab || null,

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
