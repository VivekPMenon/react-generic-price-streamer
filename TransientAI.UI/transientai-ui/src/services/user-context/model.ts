export interface UserContext {
  userName?: string;
  userId?: string;
  role?: RoleType;
  token?: string;
  accessibleResources?: Resource[];
  userInitials?: string;
  userInfo?: UserInfo;
}

export enum RoleType {
  Trader ='Trader',
  PM ='Portfolio Manager',
  Operations = 'Operations',
  Admin = 'admin'
}

export interface Resource {
  resourceName?: string;
  hasReadAccess?: boolean;
  hasWriteAccess?: boolean;
}


export interface UserInfo {
  email: string;
  lastname: string;
  role: RoleType;
  superadmin: boolean;
  timezone: string;
  user_id: number;
  username: string;
}