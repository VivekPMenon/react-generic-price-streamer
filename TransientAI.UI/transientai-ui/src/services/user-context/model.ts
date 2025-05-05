export interface UserContext {
  userName?: string;
  userId?: string;
  role?: RoleType;
  token?: string;
  accessibleResources?: Resource[];
  userInitials?: string;
}

export enum RoleType {
  Trader ='Trader',
  PM ='Portfolio Manager',
  Operations = 'Operations',
  Admin = 'admin',
  SuperAdmin = 'Super Admin'
}

export interface Resource {
  resourceName?: string;
  hasReadAccess?: boolean;
  hasWriteAccess?: boolean;
}