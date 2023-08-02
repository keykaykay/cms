<script lang="ts" setup>
import axios from 'axios'

onMounted(async () => {
  const data = await axios.get('/api/test')
  // const data = await httpInstance.get({
  //   url: '/api/test',
  //   payload: {
  //     name: 'zkmefun',
  //   },
  // })
})
</script>

<template>
  <div>123</div>
</template>
