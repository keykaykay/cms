<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { useAppStore } from '@/store/app'

// 切换主题
const theme = useDark()
const appStore = useAppStore()

const railStyle = ({
  focused,
  checked,
}: {
  focused: boolean
  checked: boolean
}) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#2f3542'
    if (focused)
      style.boxShadow = '0 0 0 2px #2f3542'
  }
  else {
    style.background = '#F3F4F6'
    if (focused)
      style.boxShadow = '0 0 0 2px #F3F4F6'
  }
  return style
}

const handleUpdateSwitchEvent = () => {
  appStore.theme = unref(theme)
}
</script>

<template>
  <n-switch
    v-model:value="theme"
    :rail-style="railStyle"
    size="small"
    @update:value="handleUpdateSwitchEvent"
  >
    <template #icon>
      <n-icon class="i-carbon:light-filled" />
    </template>
    <template #checked-icon>
      <n-icon class="i-akar-icons:moon-fill" />
    </template>
  </n-switch>
</template>
