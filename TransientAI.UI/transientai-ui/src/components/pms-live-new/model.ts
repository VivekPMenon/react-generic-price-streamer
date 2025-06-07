import { ColDef } from 'ag-grid-community'

export interface IPmsGridColsList {
  label: string
  column_name: string
  is_default: boolean
  is_frozen: boolean
  order_id: number
  is_selected: boolean,
  field?: string
}

export interface IPmsGridDataList {
  Manager: string
  National: string
  sid: string
}

export interface IColumnItem extends ColDef {
  label?: string
  column_name?: string
  is_default?: boolean
  is_frozen?: boolean
  order_id?: number
  is_selected?: boolean
  id?: number | string | undefined
}
