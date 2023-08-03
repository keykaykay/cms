<script lang="ts" setup>
import { type MenuOption, NMenu } from 'naive-ui'
import { renderMenuItem } from '@/utils/tools'
import { useAppStore } from '@/store/app'

const router = useRouter()
const appStore = useAppStore()
const menuRef = ref<HTMLDivElement>()
const resultMenu = ref<MenuOption[]>([])

const handleChangeMenu = (key: string) => {
  router.push(key)
}
useResizeObserver(menuRef, (entries) => {
  const entry = entries[0]
  const { width } = entry.contentRect
  const moreItemWidth = 60
  const normalItemWidth = 140
  const wrapWidth = width - moreItemWidth
  const itemCount = Math.floor(wrapWidth / normalItemWidth)
  resultMenu.value = []
  const minCount = Math.min(itemCount, appStore.menus.length)
  for (let index = 0; index < minCount; index++) {
    const menuRaw = appStore.menus[index]
    resultMenu.value.push(renderMenuItem(menuRaw))
  }

  if (itemCount < appStore.menus.length) {
    const otherItems: MenuOption[] = []
    for (let index = itemCount; index < appStore.menus.length; index++) {
      const menuRaw = appStore.menus[index]
      otherItems.push(renderMenuItem(menuRaw))
    }
    resultMenu.value.push({
      key: 'more',
      label: () =>
        h('div', { class: 'w-40px text-2xl i-material-symbols:more-horiz' }),
      children: otherItems,
    })
  }
})
</script>

<template>
  <NMenu
    ref="menuRef"
    class="h-full flex justify-center items-center"
    mode="horizontal"
    :options="resultMenu"
    :value="appStore.activeKey"
    @update:value="handleChangeMenu"
  />
</template>
