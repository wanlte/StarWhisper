<template>
  <view class="app">
    <slot />
  </view>
</template>

<script setup>
// #ifdef MP-WEIXIN
import { CLOUD_ENV_ID } from './api/config';
// #endif
import { onLaunch } from '@dcloudio/uni-app';

/**
 * 应用启动初始化
 * 初始化微信云开发环境
 */
onLaunch(() => {
  console.log('星语小馆 StarWhisper 启动');
  // #ifdef MP-WEIXIN
  uni.cloud.init({ env: CLOUD_ENV_ID });
  console.log('Cloud init OK, env:', CLOUD_ENV_ID);
  // #endif
});
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>
