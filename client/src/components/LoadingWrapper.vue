<template>
  <view v-if="loading" class="loading-wrap">
    <view class="loading-spinner" />
    <text v-if="text" class="loading-text">{{ text }}</text>
  </view>
  <slot v-else />
</template>

<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  text: { type: String, default: '加载中...' }
});
</script>

<style lang="scss" scoped>
.loading-wrap {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 80rpx 0;
}
.loading-spinner {
  width: 60rpx; height: 60rpx;
  border: 4rpx solid rgba(212, 165, 116, 0.2);
  border-top-color: #D4A574;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.loading-text {
  margin-top: 24rpx; font-size: 26rpx; color: #B0B0C0;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
