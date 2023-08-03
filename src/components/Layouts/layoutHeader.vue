<script lang="ts" setup>
import TopMenu from './topMenu.vue'
import SysSetting from './sysSetting.vue'
import MobileMenu from './mobileMenu.vue'

import { useMobile } from '@/hooks/useDevice'
import { useAppStore } from '@/store/app'
import { VITE_APP_TITLE, primaryColor } from '@/utils/constants'
import { localCacheStorage } from '@/utils/storage'

const props = defineProps<{
  wrapRef: HTMLElement | undefined
}>()

const router = useRouter()
const appStore = useAppStore()
const { isMobile } = useMobile()
const { isFullscreen, toggle } = useFullscreen(props.wrapRef)
const mobileMenu = ref(false)
const settingDrawer = ref(false)

const handleChangeCollapse = () => {
  if (isMobile.value)
    mobileMenu.value = true
  else
    appStore.collapsed = !appStore.collapsed
}

const handleLogout = () => {
  localCacheStorage.clear()
  router.push('/login')
}

watch([isMobile], () => {
  mobileMenu.value = false
})
</script>

<template>
  <n-layout-header
    class="w-full h-12 flex items-center relative justify-between border-gray-1 border-b-1"
  >
    <div
      v-if="appStore.model === 'top' && !isMobile"
      class="min-w-130px ml-2 flex items-center cursor-pointer"
      @click="router.push('/')"
    >
      <n-icon class="i-noto-v1:panda text-4xl" />
      <transition
        name="fade"
        enter-active-class="animate__animated animate__flipInX"
        appear
      >
        <div class="ml-2 text-xl">
          {{ VITE_APP_TITLE }}
        </div>
      </transition>
    </div>
    <TopMenu v-if="appStore.model === 'top' && !isMobile" class="flex-1" />
    <div
      v-if="appStore.model === 'left' || isMobile"
      class="text-3xl cursor-pointer ml-2"
      :class="[
        isMobile
          ? 'i-system-uicons:window-collapse-right'
          : appStore.collapsed
            ? 'i-system-uicons:window-collapse-right'
            : 'i-system-uicons:window-collapse-left',
      ]"
      @click="handleChangeCollapse"
    />
    <div class="min-w-130px mr-2 flex items-center justify-end">
      <div class="mr-5">
        <n-tooltip trigger="hover">
          <template #trigger>
            <div
              class="cursor-pointer text-28px"
              :class="[
                isFullscreen
                  ? 'i-ic:baseline-fullscreen-exit'
                  : 'i-ic:baseline-fullscreen',
              ]"
              @click="toggle()"
            />
          </template>
          <span>{{ isFullscreen ? '退出全屏' : '进入全屏' }}</span>
        </n-tooltip>
      </div>
      <div class="mr-5">
        <n-popover trigger="hover">
          <template #trigger>
            <div class="flex items-center cursor-pointer">
              <n-avatar round size="small" src="https://picsum.photos/200" />
              <span class="ml-2">admin</span>
            </div>
          </template>
          <n-grid :cols="1">
            <n-gi
              class="flex items-center cursor-pointer p-2"
              :class="`hover:text-${primaryColor}`"
            >
              <div class="i-material-symbols:lock mr-1" />
              <div>修改密码</div>
            </n-gi>
            <n-gi
              class="flex items-center cursor-pointer p-2"
              :class="`hover:text-${primaryColor}`"
              @click="handleLogout"
            >
              <div class="i-ri:logout-box-r-fill mr-1" />
              <div>退出登录</div>
            </n-gi>
          </n-grid>
        </n-popover>
      </div>
      <div
        class="i-ic:sharp-settings cursor-pointer text-24px"
        @click="settingDrawer = true"
      />
    </div>
  </n-layout-header>
  <MobileMenu
    :mobile-drawer="mobileMenu"
    :close-drawer-event="() => (mobileMenu = false)"
  />
  <SysSetting
    :setting-drawer="settingDrawer"
    :close-drawer-event="() => (settingDrawer = false)"
  />
</template>
