export interface MenuInfo {
  id?: string;
  description?: string;
  badgeCount?: number;
  icon?: string;
  subDescription?: string;
  children?: MenuInfo[];
}

export interface ActiveMenuData {
  selectedMenu?: MenuInfo;
  activeMenuList?: MenuInfo[];
}

export interface MenuContextDataType {
  activeMenuData?: ActiveMenuData;
  setActiveMenuData?: (data: ActiveMenuData) => void;
}