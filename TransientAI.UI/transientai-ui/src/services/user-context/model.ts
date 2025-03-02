export interface UserContext {
  userName?: string;
  userId?: string;
  role?: RoleType;
  token?: string;
  accessibleResource?: any[];
}

export enum RoleType {
  Trader ='Trader',
  PM ='PM',
  Operations = 'Operations'
}