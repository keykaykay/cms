<script lang="ts" setup>
const wrapRef = ref<HTMLElement>()
</script>

<template>
  <n-layout
    ref="wrapRef"
    class="h-full"
    :content-style="{
      display: 'flex',
      width: '100%',
      height: '100%',
    }"
    has-sider
  >
    <LayoutSider />
    <n-layout
      class="flex-1 h-full"
      :content-style="{
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <LayoutHeader :wrap-ref="wrapRef" />
      <n-layout-content class="flex-1">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
