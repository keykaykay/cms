<script lang="ts" setup>
import type { Ref } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/hooks/useEcharts'

const props = withDefaults(
  defineProps<{
    option: EChartsOption
  }>(),
  {},
)

const emits = defineEmits(['chartClick'])

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions, getInstance, resize } = useEcharts(
  chartRef as Ref<HTMLDivElement>,
)

onMounted(() => {
  const chartInstance = getInstance()
  chartInstance?.on('click', (params: any) => {
    emits('chartClick', params)
  })
  watch(
    () => props.option,
    () => {
      setOptions(props.option)
    },
    {
      immediate: true,
      deep: true,
    },
  )
})

defineExpose({ resize })
</script>

<template>
  <div class="w-full h-full">
    <div ref="chartRef" class="w-full h-full" />
  </div>
</template>
