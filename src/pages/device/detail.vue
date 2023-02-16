<script lang="ts" setup>
import { type MenuOption, NMenu } from 'naive-ui'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const testRef = ref<HTMLDivElement>()
const activeKey = ref<string | null>(null)
const router = useRouter()
const resultMenu = ref<MenuOption[]>([])
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h('div', { class: 'w-100px flex items-center justify-center' }, [
        h('div', { class: 'i-material-symbols:content-paste-search mr-1' }),
        h('div', {}, '测试测试'),
      ]),
    key: 1,
  },
  {
    label: () =>
      h('div', { class: 'w-100px flex items-center justify-center' }, [
        h('div', { class: 'i-material-symbols:content-paste-search' }),
        h('div', {}, '测试测试'),
      ]),
    key: 2,
  },
  {
    label: () =>
      h('div', { class: 'w-100px flex items-center justify-center' }, [
        h('div', { class: 'i-material-symbols:content-paste-search' }),
        h('div', {}, '测试测试'),
      ]),
    key: 3,
  },
  {
    key: 'fsfdsfdsfsd',
    label: () => h('div', { class: 'w-60px i-material-symbols:more-horiz' }),
  },
]

useResizeObserver(testRef, (entries) => {
  const entry = entries[0]
  const { width } = entry.contentRect
  const wrapWidth = width - 60
  const itemCount = Math.floor(wrapWidth / 140)
  resultMenu.value = []
  const minCount = Math.min(itemCount, appStore.menus.length)
  for (let index = 0; index < minCount; index++) {
    const menuRaw = appStore.menus[index]
    resultMenu.value.push({
      key: menuRaw?.path,
      label: () =>
        h('div', { class: 'w-100px flex items-center justify-center' }, [
          h('div', { class: `${menuRaw?.meta?.icon || ''}` }),
          h('div', { class: 'ml-1' }, menuRaw?.meta?.title || ''),
        ]),
    })
  }

  if (itemCount < appStore.menus.length) {
    const otherItems: MenuOption[] = []
    for (let index = itemCount; index < appStore.menus.length; index++) {
      const menuRaw = appStore.menus[index]
      otherItems.push({
        key: menuRaw?.path,
        label: () =>
          h('div', { class: 'w-100px flex items-center justify-center' }, [
            h('div', { class: `${menuRaw?.meta?.icon || ''}` }),
            h('div', { class: 'ml-1' }, menuRaw?.meta?.title || ''),
          ]),
      })
    }
    resultMenu.value.push({
      key: 'more',
      label: () =>
        h('div', { class: 'w-40px text-2xl i-material-symbols:more-horiz' }),
      children: otherItems,
    })
  }
})

const handleChangeMenu = (key: string) => {
  router.push(key)
}
</script>

<template>
  <div class="h-full w-full">
    <n-scrollbar x-scrollable class="h-12 w-100 bg-red">
      <NMenu
        v-model:value="activeKey"
        mode="horizontal"
        :options="menuOptions"
      />
    </n-scrollbar>
    <div class="mt-3 w-full bg-red flex">
      <div class="w-100px bg-blue" />
      <NMenu
        ref="testRef"
        class="flex-1 flex justify-center"
        mode="horizontal"
        dropdown-placement="bottom"
        :options="resultMenu"
        :value="appStore.activeKey"
        @update:value="handleChangeMenu"
      />
      <div class="w-100px bg-blue" />
    </div>
  </div>
</template>

<!-- <style lang="scss" scoped>
:deep(.n-menu-item) {
  width: 120px;
}
:deep(.n-menu-item-content) {
  display: inline-flex;

  .n-menu-item-content__icon {
    margin-right: 3px !important;
  }
}
</style> -->

<route lang="yaml">
meta:
  title: 设备
  order: 2
  icon: i-fa6-solid:rectangle-list
</route>
