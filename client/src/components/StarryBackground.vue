<template>
  <view class="starry-bg">
    <!-- Nebula clouds -->
    <view class="nebula nebula--purple" />
    <view class="nebula nebula--blue" />
    <view class="nebula nebula--pink" />
    <view class="nebula nebula--cyan" />

    <!-- Distant stars (small, dim) -->
    <view
      v-for="s in distantStars"
      :key="'d-'+s.id"
      class="star star--distant"
      :style="starStyle(s)"
    />
    <!-- Mid stars -->
    <view
      v-for="s in midStars"
      :key="'m-'+s.id"
      class="star star--mid"
      :style="starStyle(s)"
    />
    <!-- Near/bright stars -->
    <view
      v-for="s in nearStars"
      :key="'n-'+s.id"
      class="star star--near"
      :style="starStyle(s)"
    />
    <!-- Highlighted sparkle stars -->
    <view
      v-for="s in sparkleStars"
      :key="'s-'+s.id"
      class="star star--sparkle"
      :style="sparkleStyle(s)"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue';

function genStars(count, baseId) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      id: baseId + i,
      x: Math.random() * 750,
      y: Math.random() * 1200,
      size: 0,
      opacity: 0,
      delay: Math.random() * 5,
      duration: 0
    });
  }
  return arr;
}

const distantStars = ref(genStars(30, 'd'));
const midStars = ref(genStars(25, 'm'));
const nearStars = ref(genStars(15, 'n'));
const sparkleStars = ref(genStars(8, 's'));

function starStyle(s) {
  return {
    left: s.x + 'rpx',
    top: s.y + 'rpx',
    opacity: s.opacity,
    animationDelay: s.delay + 's',
    animationDuration: s.duration + 's'
  };
}

function sparkleStyle(s) {
  return {
    left: s.x + 'rpx',
    top: s.y + 'rpx',
    animationDelay: s.delay + 's',
    animationDuration: s.duration + 's'
  };
}
</script>

<style lang="scss" scoped>
.starry-bg {
  position: fixed; inset: 0; z-index: 0;
  overflow: hidden; pointer-events: none;
}

// --- Nebula clouds ---
.nebula {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
}
.nebula--purple {
  width: 620rpx; height: 620rpx;
  background: radial-gradient(ellipse at center,
    rgba(123, 47, 190, 0.18) 0%,
    rgba(123, 47, 190, 0.06) 30%,
    rgba(123, 47, 190, 0.01) 50%,
    transparent 65%
  );
  top: -6%; left: 3%;
  animation: nebula-drift 28s ease-in-out infinite alternate;
  animation-delay: 0s;
}
.nebula--blue {
  width: 540rpx; height: 540rpx;
  background: radial-gradient(ellipse at center,
    rgba(59, 95, 217, 0.15) 0%,
    rgba(59, 95, 217, 0.05) 30%,
    rgba(59, 95, 217, 0.01) 50%,
    transparent 65%
  );
  top: 40%; right: -5%;
  animation: nebula-drift 24s ease-in-out infinite alternate;
  animation-delay: -8s;
}
.nebula--pink {
  width: 460rpx; height: 460rpx;
  background: radial-gradient(ellipse at center,
    rgba(196, 77, 142, 0.14) 0%,
    rgba(196, 77, 142, 0.05) 30%,
    rgba(196, 77, 142, 0.01) 50%,
    transparent 65%
  );
  bottom: -4%; left: 25%;
  animation: nebula-drift 32s ease-in-out infinite alternate;
  animation-delay: -16s;
}
.nebula--cyan {
  width: 380rpx; height: 380rpx;
  background: radial-gradient(ellipse at center,
    rgba(46, 196, 182, 0.10) 0%,
    rgba(46, 196, 182, 0.04) 30%,
    rgba(46, 196, 182, 0.01) 50%,
    transparent 65%
  );
  top: 20%; left: 50%;
  animation: nebula-drift 20s ease-in-out infinite alternate;
  animation-delay: -4s;
}

@keyframes nebula-drift {
  0% { transform: translate(0, 0); }
  33% { transform: translate(30rpx, -20rpx); }
  66% { transform: translate(-20rpx, 25rpx); }
  100% { transform: translate(15rpx, -10rpx); }
}

// --- Stars ---
.star {
  position: absolute;
  background: #FFFFFF;
  border-radius: 50%;
  animation: twinkle ease-in-out infinite alternate;
}

// Distant: tiny, faint, slow
.star--distant {
  width: 2rpx; height: 2rpx;
  opacity: 0.2;
  animation-duration: 4s;
  &:nth-child(odd) { animation-duration: 5s; }
  &:nth-child(3n) { animation-duration: 6s; }
}

// Mid: small, medium brightness
.star--mid {
  width: 3rpx; height: 3rpx;
  opacity: 0.4;
  animation-duration: 3s;
  &:nth-child(odd) { animation-duration: 4s; }
  &:nth-child(3n) { animation-duration: 3.5s; }
}

// Near: larger, brighter
.star--near {
  width: 5rpx; height: 5rpx;
  opacity: 0.6;
  animation-duration: 2.5s;
  &:nth-child(odd) { animation-duration: 3s; }
  &:nth-child(3n) { animation-duration: 2s; }
}

// Sparkle: bright with glow
.star--sparkle {
  width: 5rpx; height: 5rpx;
  opacity: 0.75;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 0 8rpx 2rpx rgba(255, 255, 255, 0.3),
              0 0 16rpx 4rpx rgba(180, 160, 255, 0.12);
  animation: twinkle-sparkle 2s ease-in-out infinite alternate;
  &:nth-child(odd) { animation-duration: 2.5s; }
  &:nth-child(3n) { animation-duration: 1.8s; }
}

@keyframes twinkle {
  0% { transform: scale(1); opacity: inherit; }
  100% { transform: scale(0.25); opacity: 0.05; }
}

@keyframes twinkle-sparkle {
  0% { transform: scale(1); opacity: 0.75; }
  50% { transform: scale(1.6); opacity: 0.95; }
  100% { transform: scale(0.5); opacity: 0.3; }
}
</style>
