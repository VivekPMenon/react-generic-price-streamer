export interface UserContext {
  userName?: string;
  userId?: string;
  role?: RoleType;
  token?: string;
  accessibleResources?: Resource[];
}

export enum RoleType {
  Trader ='Trader',
  PM ='PM',
  Operations = 'Operations'
}

export interface Resource {
  resourceName?: string;
  hasReadAccess?: boolean;
  hasWriteAccess?: boolean;
}