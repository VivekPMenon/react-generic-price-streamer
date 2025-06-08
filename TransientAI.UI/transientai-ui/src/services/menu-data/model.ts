//src/services/menu-data/model.ts
import {TabInfo} from "@/components/dashboard-tabs/model";

export interface MenuInfo extends TabInfo {
  badgeCount?: number;
  icon?: string;
  subDescription?: string;
  children?: MenuInfo[];
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