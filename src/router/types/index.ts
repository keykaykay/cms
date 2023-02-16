import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface AppRouteRecordRaw
  extends Partial<RouteLocationNormalizedLoaded> {
  meta?: {
    title?: string
    icon?: string
  }
  [key: string]: any
}
