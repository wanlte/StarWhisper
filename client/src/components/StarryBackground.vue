<template>
  <view class="starry-bg">
    <!-- Nebula clouds -->
    <view class="nebula nebula--purple" />
    <view class="nebula nebula--blue" />
    <view class="nebula nebula--pink" />
    <view class="nebula nebula--cyan" />

    <!-- Distant stars -->
    <view
      v-for="s in distantStars" :key="'d-'+s.id"
      class="star star--distant" :style="starStyle(s)"
    />
    <!-- Mid stars -->
    <view
      v-for="s in midStars" :key="'m-'+s.id"
      class="star star--mid" :style="starStyle(s)"
    />
    <!-- Near/bright stars -->
    <view
      v-for="s in nearStars" :key="'n-'+s.id"
      class="star star--near" :style="starStyle(s)"
    />
    <!-- Highlighted sparkle stars -->
    <view
      v-for="s in sparkleStars" :key="'s-'+s.id"
      class="star star--sparkle" :style="sparkleStyle(s)"
    />
    <!-- Shooting stars -->
    <view
      v-for="m in meteors" :key="'m-'+m.id"
      class="meteor" :style="meteorStyle(m)"
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

// Shooting stars: periodic, diagonal streaks
const meteors = ref(
  Array.from({ length: 4 }, (_, i) => ({
    id: i,
    x: Math.random() * 500,
    y: 100 + Math.random() * 600,
    delay: 3 + Math.random() * 12,
    duration: 1.2 + Math.random() * 1.5
  }))
);

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

function meteorStyle(m) {
  return {
    left: m.x + 'rpx',
    top: m.y + 'rpx',
    animationDelay: m.delay + 's',
    animationDuration: m.duration + 's'
  };
}
</script>

<style lang="scss" scoped>
.starry-bg {
  position: fixed; inset: 0; z-index: 0;
  overflow: hidden; pointer-events: none;
}

/* Nebula clouds */
.nebula {
  position: fixed; border-radius: 50%;
  pointer-events: none; will-change: transform;
}
.nebula--purple {
  width: 620rpx; height: 620rpx;
  background: radial-gradient(ellipse at center,
    rgba(123, 47, 190, 0.18) 0%,
    rgba(123, 47, 190, 0.06) 30%,
    transparent 65%
  );
  top: -6%; left: 3%;
  animation: nebula-drift 28s ease-in-out infinite alternate;
}
.nebula--blue {
  width: 540rpx; height: 540rpx;
  background: radial-gradient(ellipse at center,
    rgba(59, 95, 217, 0.15) 0%,
    rgba(59, 95, 217, 0.05) 30%,
    transparent 65%
  );
  top: 40%; right: -5%;
  animation: nebula-drift 24s ease-in-out infinite alternate;
  animation-delay: -8s;
}
.nebula--pink {
  width: 460rpx; height: 460rpx;
  background: radial-gradient(ellipse at center,
    rgba(196, 77, 142, 0.16) 0%,
    rgba(196, 77, 142, 0.05) 30%,
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
    transparent 65%
  );
  top: 20%; left: 50%;
  animation: nebula-drift 20s ease-in-out infinite alternate;
  animation-delay: -4s;
}

@keyframes nebula-drift {
  0%   { transform: translate(0, 0); }
  33%  { transform: translate(30rpx, -20rpx); }
  66%  { transform: translate(-20rpx, 25rpx); }
  100% { transform: translate(15rpx, -10rpx); }
}

/* Stars */
.star {
  position: absolute;
  background: #FFFFFF;
  border-radius: 50%;
  animation: twinkle ease-in-out infinite alternate;
}
.star--distant { width: 2rpx; height: 2rpx; opacity: 0.2; animation-duration: 4s; }
.star--distant:nth-child(odd) { animation-duration: 5s; }
.star--distant:nth-child(3n) { animation-duration: 6s; }

.star--mid { width: 3rpx; height: 3rpx; opacity: 0.4; animation-duration: 3s; }
.star--mid:nth-child(odd) { animation-duration: 4s; }
.star--mid:nth-child(3n) { animation-duration: 3.5s; }

.star--near { width: 5rpx; height: 5rpx; opacity: 0.6; animation-duration: 2.5s; }
.star--near:nth-child(odd) { animation-duration: 3s; }
.star--near:nth-child(3n) { animation-duration: 2s; }

.star--sparkle {
  width: 5rpx; height: 5rpx; opacity: 0.75;
  background: #FFFFFF; border-radius: 50%;
  box-shadow: 0 0 8rpx 2rpx rgba(255,255,255,0.3),
              0 0 16rpx 4rpx rgba(180,160,255,0.12);
  animation: twinkle-sparkle 2s ease-in-out infinite alternate;
}
.star--sparkle:nth-child(odd) { animation-duration: 2.5s; }
.star--sparkle:nth-child(3n) { animation-duration: 1.8s; }

@keyframes twinkle {
  0%   { transform: scale(1); opacity: inherit; }
  100% { transform: scale(0.25); opacity: 0.05; }
}

@keyframes twinkle-sparkle {
  0%   { transform: scale(1); opacity: 0.75; }
  50%  { transform: scale(1.6); opacity: 0.95; }
  100% { transform: scale(0.5); opacity: 0.3; }
}

/* Shooting stars / meteors */
.meteor {
  position: absolute;
  width: 2rpx;
  height: 80rpx;
  background: linear-gradient(to bottom,
    rgba(255,255,255,0.9) 0%,
    rgba(255,255,255,0.6) 20%,
    rgba(200,180,255,0.3) 50%,
    transparent 100%
  );
  border-radius: 1rpx;
  transform: rotate(-35deg);
  opacity: 0;
  animation: meteor-shoot ease-out infinite;
}

@keyframes meteor-shoot {
  0% {
    opacity: 0;
    transform: rotate(-35deg) translateX(0) translateY(0);
  }
  8% {
    opacity: 1;
  }
  15% {
    opacity: 0;
    transform: rotate(-35deg) translateX(-200rpx) translateY(200rpx);
  }
  100% {
    opacity: 0;
    transform: rotate(-35deg) translateX(-200rpx) translateY(200rpx);
  }
}
</style>
