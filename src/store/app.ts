import type { AppRouteRecordRaw } from '@/router/types'
import router from '@/router'

interface ICacheInfo {
  token?: string
  department?: string
}
interface IApp {
  theme: boolean
  collapsed: boolean
  model: 'left' | 'top'
  cache: ICacheInfo
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): IApp => ({
    theme: false,
    collapsed: false,
    model: 'left',
    cache: {},
  }),
  getters: {
    menus(): AppRouteRecordRaw[] {
      return router
        .getRoutes()
        .filter(route => route.meta.order && route.name)
        .sort((a, b) => Number(a.meta.order) - Number(b.meta.order))
    },
    activeKey() {
      const route = useRoute()
      return route.path
    },
  },
  actions: {},
})
