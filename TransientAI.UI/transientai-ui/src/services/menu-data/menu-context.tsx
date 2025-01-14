'use client';

import { createContext, useState } from "react";
import { ActiveMenuData, MenuContextDataType } from "./model";

export const MenuContextData = createContext<MenuContextDataType>({
  activeMenuData: {},
});

export function MenuContextDataProvider({children}: any) {

  const [activeMenuData, setActiveMenuData] = useState<ActiveMenuData>({
    activeMenuList: []
  });

  return <MenuContextData.Provider value={{activeMenuData, setActiveMenuData}}>
    {children}
  </MenuContextData.Provider>
}