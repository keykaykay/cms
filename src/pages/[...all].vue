<script lang="ts" setup>
import NotFoundPage from '@/assets/404.svg'

const router = useRouter()
</script>

<template>
  <div class="h-full w-full flex justify-center items-center">
    <n-empty :show-icon="false" size="huge">
      <template #extra>
        <n-button type="info" @click="router.push('/')">
          返回首页
        </n-button>
      </template>
      <template #icon />
      <div>
        <n-image preview-disabled :src="NotFoundPage" width="400" />
        <div class="text-center mt-3">
          对不起，您访问的页面不存在
        </div>
      </div>
    </n-empty>
  </div>
</template>

<route lang="yaml">
meta:
  title: 空页面
</route>
