<script lang="ts" setup>
import { type EChartsOption } from 'echarts'

const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
    },
  ],
} as EChartsOption
</script>

<template>
  <div class="w-full h-full">
    <Charts :option="option" />
  </div>
</template>

<route lang="yaml">
meta:
  title: test1
  order: 3
  icon: i-fa6-solid:rectangle-list
</route>
