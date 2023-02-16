<script lang="ts" setup>
const bgUrl = ref(
  `https://files.codelife.cc/itab/defaultWallpaper/videos/${String(
    Math.floor(Math.random() * 7),
  ).padStart(2, '0')}.mp4`,
)
</script>

<template>
  <div class="wrap">
    <video class="video" :src="bgUrl" autoplay loop muted />
    <div class="cover bg-gray-3 bg-opacity-70 dark:bg-gray-9" />
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;

  .video {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
}
</style>
