<script lang="ts" setup>
import { type MenuOption, NMenu } from 'naive-ui'
import { renderIcon, renderLabel } from '@/utils/tools'
import { useAppStore } from '@/store/app'
import { VITE_APP_TITLE } from '@/utils/constants'
import { useMobile } from '@/hooks/useDevice'

const router = useRouter()
const appStore = useAppStore()
const { isMobile } = useMobile()
const menuOptions = computed<MenuOption[]>(() =>
  appStore.menus.map(item => ({
    label: renderLabel(item.meta?.title || '', item.path || ''),
    icon: renderIcon(item.meta?.icon),
    key: item.path,
  })),
)
</script>

<template>
  <div class="w-full h-full color-white">
    <div
      class="h-12 flex justify-center items-center cursor-pointer"
      @click="router.push('/')"
    >
      <n-icon class="i-noto-v1:panda text-4xl" />
      <transition
        name="fade"
        enter-active-class="animate__animated animate__flipInX"
        appear
      >
        <div v-show="!appStore.collapsed || isMobile" class="ml-2 text-xl mt-1">
          {{ VITE_APP_TITLE }}
        </div>
      </transition>
    </div>
    <NMenu
      inverted
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="appStore.activeKey"
    />
  </div>
</template>
