export interface UserContext {
  userName?: string;
  userId?: string;
  roles?: RoleType[];
  token?: string;
  accessibleResources?: Resource[];
  userInitials?: string;
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