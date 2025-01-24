'use client';

import { createContext, useState } from "react";
import { ActiveMenuData, MenuContextDataType } from "./model";
import { menuInfoList } from "./menu-data-service";

export const MenuContextData = createContext<MenuContextDataType>({
  activeMenuData: {},
});

export function MenuContextDataProvider({children}: any) {

  const todaysAxes = menuInfoList.find(menuInfo => menuInfo.description === `Today's Axes`);

  const [activeMenuData, setActiveMenuData] = useState<ActiveMenuData>({
    activeMenuList: [todaysAxes!],
    fullMenuLIst: menuInfoList,
    selectedMenu: todaysAxes
  });

  return <MenuContextData.Provider value={{activeMenuData, setActiveMenuData}}>
    {children}
  </MenuContextData.Provider>
}