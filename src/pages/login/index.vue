<script lang="ts" setup>
import {
  type FormInst,
  type FormRules,
  useMessage,
  useNotification,
} from 'naive-ui'
import dayjs from 'dayjs'
import { VITE_APP_TITLE } from '@/utils/constants'
import { useMobile } from '@/hooks/useDevice'
import LogoBox from '@/assets/logo-box.svg'
import { localCacheStorage } from '@/utils/storage'

const router = useRouter()
const message = useMessage()
const notification = useNotification()
const { isMobile } = useMobile()
// form表单
const ruleFormRef = ref<FormInst | null>()
const submitLoading = ref(false)
const formModel = reactive({
  account: '',
  password: '',
})
const formRules = reactive<FormRules>({
  account: [
    {
      required: true,
      message: '请输入账号',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
})
const buttonDisable = computed(() => {
  const val = Object.values(formModel).find(val => val === '')
  return val !== undefined
})

const handleLoginEvent = () => {
  submitLoading.value = true
  ruleFormRef.value?.validate(async (error) => {
    if (!error) {
      submitLoading.value = false
      message.success('登录成功')
      notification.success({
        title: 'admin',
        content: '欢迎回来',
        description: `当前时间${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
        duration: 1500,
      })
      localCacheStorage.set('token', 'token123456')
      router.push('/device')
    }
    else {
      message.error('登录失败')
    }
  })
}
</script>

<template>
  <Background />
  <div class="h-full w-full bg-white bg-opacity-35 flex sm:flex-row flex-col">
    <div class="h-full flex-1 hidden sm:flex flex-col">
      <div class="h-20 flex pl-10 items-center">
        <n-icon class="i-noto-v1:panda text-4xl" />
        <div class="ml-2 font-700 text-2xl mt-1">
          {{ VITE_APP_TITLE }}
        </div>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center">
        <img class="w-1/2" :src="LogoBox" alt="logobox">
        <div class="mt-10 text-xl font-700">
          中后台管理系统
        </div>
      </div>
    </div>
    <div class="relative h-full flex-1 flex justify-center items-center">
      <div v-if="isMobile" class="absolute top-5 left-5 flex items-center">
        <n-icon class="i-noto-v1:panda text-4xl" />
        <div class="ml-2 font-700 text-2xl">
          {{ VITE_APP_TITLE }}
        </div>
      </div>
      <SwitchTheme class="absolute top-5 right-5" />
      <n-card
        hoverable
        class="h-400px w-4/5 bg-white bg-opacity-50 dark:bg-black"
      >
        <n-form ref="ruleFormRef" :model="formModel" :rules="formRules">
          <div class="flex justify-center mb-10">
            <div class="text-2xl font-bold">
              登录
            </div>
          </div>
          <n-form-item path="account">
            <n-input
              v-model:value="formModel.account"
              placeholder="请输入账号"
              clearable
            >
              <template #prefix>
                <div class="i-mdi:account-circle-outline" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formModel.password"
              placeholder="请输入密码"
              type="password"
              show-password-on="click"
              clearable
            >
              <template #prefix>
                <div class="i-mdi:lock-outline" />
              </template>
            </n-input>
          </n-form-item>
          <div class="w-full mt-15 flex justify-center">
            <n-button
              type="info"
              class="w-4/5"
              :disabled="buttonDisable"
              :loading="submitLoading"
              attr-type="submit"
              @click="handleLoginEvent"
            >
              登录
            </n-button>
          </div>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: fullscreen
  title: 登录
</route>
