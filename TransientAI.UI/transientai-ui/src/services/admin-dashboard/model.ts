export enum SearchTableName{
  USER = "users",
  ROLE = "roles"
}

export enum SearchQueryType{
  EMAIL = 'email',
  FULLNAME = 'fullname'
}

/**
 * Type for form data structure
 */
export interface UserFormData {
  user_id: number | null
  first_name: string
  last_name: string
  email: string
  is_active: boolean
  is_super_admin: boolean
  role_name?: string
  role_id?: number | null
  user_type: string
}

export interface RoleFormData{
  role_name: string
}

export interface IUpdateUserConfigReq {
  user_id: number
  corporate_actions_data: string[]
  margin_data: string[]
}

export interface IUpdateRoleConfigReq {
  role_id: number;
  screens: number[];
  pms_data: string[];
}