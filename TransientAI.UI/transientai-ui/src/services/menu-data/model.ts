//src/services/menu-data/model.ts
export interface MenuInfo {
  id?: string;
  key?: string;
  description?: string;
  badgeCount?: number;
  icon?: string;
  subDescription?: string;
  children?: MenuInfo[];
  route?: string;
  priorityId?: number;
}

export interface ActiveMenuData {
  selectedMenu?: MenuInfo;
  activeMenuList?: MenuInfo[];
  fullMenuLIst?: MenuInfo[];
}

export interface MenuContextDataType {
  activeMenuData?: ActiveMenuData;  
  setActiveMenuData?: (data: ActiveMenuData) => void;
}