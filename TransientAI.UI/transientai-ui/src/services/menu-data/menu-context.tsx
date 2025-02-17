'use client';

import { createContext, useState } from "react";
import { ActiveMenuData, MenuContextDataType } from "./model";
import { menuInfoList } from "./menu-data-service";

export const MenuContextData = createContext<MenuContextDataType>({
  activeMenuData: {},
});

export function MenuContextDataProvider({children}: any) {

  const defaultTab = menuInfoList.find(menuInfo => menuInfo.description === `Research Reports`);

  const [activeMenuData, setActiveMenuData] = useState<ActiveMenuData>({
    activeMenuList: [defaultTab!],
    fullMenuLIst: menuInfoList,
    selectedMenu: defaultTab
  });

  return <MenuContextData.Provider value={{activeMenuData, setActiveMenuData}}>
    {children}
  </MenuContextData.Provider>
}