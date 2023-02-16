import type { VNode } from 'vue'
import type { CheckboxProps, DataTableBaseColumn } from 'naive-ui'

export type TInternalRowData = Record<string, unknown>

export interface TDataColumn<T = TInternalRowData, U = keyof T> extends Omit<DataTableBaseColumn<T>, 'key' | 'title'> {
/**
   * 是否允许编辑
   */
  edit?: boolean
  /**
 * 编辑组件
 */
  editComp?: VNode
  /**
 * 添加数据的默认值
 */
  editValue?: any

  title: string

  key: U

}

export interface TAddEditTable {
  type: 'add' | 'edit'
  index: number
}

export interface TCheckbox extends CheckboxProps {
  fixed?: 'left' | 'right'
}

export interface IFormData {
  [key: string]: any
}

export interface IModalData {
  label: string
  value: any
  comp?: VNode
  path: string
}
