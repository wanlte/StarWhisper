<template>
  <view class="starry-bg">
    <view
      v-for="star in stars"
      :key="star.id"
      class="star"
      :style="{
        left: star.x + 'rpx',
        top: star.y + 'rpx',
        width: star.size + 'rpx',
        height: star.size + 'rpx',
        opacity: star.opacity,
        animationDelay: star.delay + 's',
        animationDuration: star.duration + 's'
      }"
    />
  </view>
</template>

<script setup>
import { reactive } from 'vue';

const stars = reactive([]);

function initStars() {
  // Generate 60 random stars across page width (750rpx) x height (1200rpx)
  const arr = [];
  for (let i = 0; i < 60; i++) {
    arr.push({
      id: i,
      x: Math.random() * 750,
      y: Math.random() * 1200,
      size: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.7,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 4
    });
  }
  stars.push(...arr);
}

initStars();
</script>

<style lang="scss" scoped>
.starry-bg {
  position: fixed; inset: 0; z-index: 0;
  overflow: hidden; pointer-events: none;
}
.star {
  position: absolute;
  background: #FFFFFF;
  border-radius: 50%;
  animation: twinkle ease-in-out infinite alternate;
}
@keyframes twinkle {
  0% { transform: scale(1); }
  100% { transform: scale(0.3); }
}
</style>
