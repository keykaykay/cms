import type { PiniaPluginContext } from 'pinia'

const store = createPinia()

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}
// 获取本地数据
const getStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : {}
}

const piniaPlugin = (context: PiniaPluginContext) => {
  const { store } = context
  // $subscribe state值发生变化时会执行传入的回调
  store.$subscribe(() => {
    // 每次修改值的时候更新localStorage数据
  })
  window.addEventListener('beforeunload', () => {
    setStorage(`pinia-${store.$id}`, store.$state)
  })
  // 每次构建项目的时候从本地存储取值
  const data = getStorage(`pinia-${store.$id}`)
  localStorage.removeItem(`pinia-${store.$id}`)
  return {
    ...data,
  }
}

store.use(piniaPlugin)

export default store
