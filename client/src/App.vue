<template>
  <view class="app">
    <slot />
  </view>
</template>

<script setup>
import { onLaunch } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('星语小馆 StarWhisper 启动');
});
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>
