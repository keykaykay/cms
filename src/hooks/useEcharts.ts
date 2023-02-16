import type { EChartsOption } from 'echarts'
import type { Ref } from 'vue'
import echarts from '@/utils/echarts'
import { ECHARTS_COLOR } from '@/utils/constants'

export function useEcharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'light',
) {
  let chartInstance: echarts.ECharts | null = null
  let resizeFn: Fn = resize
  const cacheOptions = ref({}) as Ref<EChartsOption>

  resizeFn = useDebounceFn(resize, 200)

  const getOptions = computed(() => cacheOptions.value as EChartsOption)

  function initCharts(t = theme) {
    const el = unref(elRef)
    if (!el || !unref(el))
      return

    chartInstance = echarts.init(el, t, { renderer: 'svg' })
    useEventListener(window, 'resize', resizeFn)
  }

  function setOptions(options: EChartsOption, clear = false) {
    cacheOptions.value = {
      color: ECHARTS_COLOR,
      ...options,
    }
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions))
      }, 30)
      return
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts()
          if (!chartInstance)
            return
        }
        clear && chartInstance?.clear()

        chartInstance?.setOption(unref(getOptions))
        resize()
      }, 30)
    })
  }

  function resize() {
    chartInstance?.resize()
  }

  tryOnUnmounted(() => {
    if (!chartInstance)
      return
    chartInstance.dispose()
    chartInstance = null
  })

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance)
      initCharts()

    return chartInstance
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  }
}
