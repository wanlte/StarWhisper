<template>
  <view class="starry-bg">
    <!-- Layer 1: Nebula clouds -->
    <view class="nebula nebula--purple" />
    <view class="nebula nebula--blue" />
    <view class="nebula nebula--pink" />
    <view class="nebula nebula--cyan" />

    <!-- Layer 2: Constellation lines -->
    <svg class="constellation-lines" viewBox="0 0 750 1100" preserveAspectRatio="none">
      <line v-for="l in constellationLines" :key="l.id"
        :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
        :style="{ opacity: l.opacity, animationDelay: l.delay + 's' }"
        class="c-line"
      />
    </svg>

    <!-- Layer 3: Soft-focus light dots -->
    <view
      v-for="s in softStars" :key="'sf-'+s.id"
      class="star-soft" :style="softStyle(s)"
    />

    <!-- Layer 4: Cross/sparkle stars -->
    <view
      v-for="s in crossStars" :key="'cs-'+s.id"
      class="star-cross" :style="crossStyle(s)"
    >
      <view class="star-cross-h" />
      <view class="star-cross-v" />
    </view>

    <!-- Layer 5: Distant tiny dots -->
    <view
      v-for="s in distantStars" :key="'d-'+s.id"
      class="star-dot" :style="dotStyle(s)"
    />

    <!-- Layer 6: Meteors -->
    <view
      v-for="m in meteors" :key="'m-'+m.id"
      class="meteor" :style="meteorStyle(m)"
    />

    <!-- Layer 7: Bottom mist -->
    <view class="mist-bottom" />

    <!-- Layer 8: Edge blur overlays -->
    <view class="edge-blur edge-blur--top" />
    <view class="edge-blur edge-blur--left" />
    <view class="edge-blur edge-blur--right" />
  </view>
</template>

<script setup>
import { ref } from 'vue';

// Cross stars with known positions for constellation lines
const crossStars = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 670,
    y: 30 + Math.random() * 950,
    size: 6 + Math.random() * 10,
    opacity: 0.3 + Math.random() * 0.5,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3
  }))
);

// Generate constellation lines between nearby cross stars
const constellationLines = ref([]);
{
  const stars = crossStars.value;
  const lines = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Connect stars within ~180rpx of each other
      if (dist < 200) {
        lines.push({
          id: `${i}-${j}`,
          x1: stars[i].x,
          y1: stars[i].y,
          x2: stars[j].x,
          y2: stars[j].y,
          opacity: 0.06 + Math.random() * 0.08,
          delay: Math.random() * 3
        });
      }
    }
  }
  constellationLines.value = lines;
}

// Soft-focus light dots
const softStars = ref(
  Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 750,
    y: Math.random() * 1100,
    size: 6 + Math.random() * 14,
    opacity: 0.15 + Math.random() * 0.35,
    delay: Math.random() * 5,
    color: Math.random() > 0.3 ? '#FFFFFF' : '#E8D5B0'
  }))
);

// Distant dots
const distantStars = ref(
  Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 750,
    y: Math.random() * 1100,
    opacity: 0,
    delay: Math.random() * 4
  }))
);

// Meteors
const meteors = ref(
  Array.from({ length: 3 }, (_, i) => ({
    id: i,
    x: Math.random() * 500,
    y: 80 + Math.random() * 500,
    delay: 4 + Math.random() * 10,
    duration: 1 + Math.random() * 1.2
  }))
);

function softStyle(s) {
  return {
    left: s.x + 'rpx',
    top: s.y + 'rpx',
    width: s.size + 'rpx',
    height: s.size + 'rpx',
    opacity: s.opacity,
    animationDelay: s.delay + 's',
    background: s.color,
    boxShadow: s.color === '#E8D5B0'
      ? `0 0 ${s.size * 2}rpx ${s.size * 0.6}rpx rgba(232,213,176,0.3)`
      : `0 0 ${s.size * 2}rpx ${s.size * 0.6}rpx rgba(200,210,255,0.2)`
  };
}

function crossStyle(s) {
  return {
    left: s.x + 'rpx',
    top: s.y + 'rpx',
    width: s.size + 'rpx',
    height: s.size + 'rpx',
    opacity: s.opacity,
    animationDelay: s.delay + 's',
    animationDuration: s.duration + 's'
  };
}

function dotStyle(s) {
  return {
    left: s.x + 'rpx',
    top: s.y + 'rpx',
    animationDelay: s.delay + 's'
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

/* ── Nebula clouds ── */
.nebula {
  position: fixed; border-radius: 50%;
  pointer-events: none; will-change: transform;
}
.nebula--purple {
  width: 620rpx; height: 620rpx;
  background: radial-gradient(ellipse at center,
    rgba(100, 40, 180, 0.2) 0%,
    rgba(80, 30, 160, 0.08) 35%,
    transparent 70%
  );
  top: -5%; left: 2%;
  animation: nebula-drift 28s ease-in-out infinite alternate;
}
.nebula--blue {
  width: 540rpx; height: 540rpx;
  background: radial-gradient(ellipse at center,
    rgba(50, 80, 200, 0.16) 0%,
    rgba(40, 70, 180, 0.06) 35%,
    transparent 70%
  );
  top: 35%; right: -8%;
  animation: nebula-drift 24s ease-in-out infinite alternate;
  animation-delay: -8s;
}
.nebula--pink {
  width: 480rpx; height: 480rpx;
  background: radial-gradient(ellipse at center,
    rgba(180, 70, 130, 0.18) 0%,
    rgba(160, 60, 120, 0.06) 35%,
    transparent 70%
  );
  bottom: -3%; left: 20%;
  animation: nebula-drift 32s ease-in-out infinite alternate;
  animation-delay: -16s;
}
.nebula--cyan {
  width: 360rpx; height: 360rpx;
  background: radial-gradient(ellipse at center,
    rgba(40, 180, 170, 0.08) 0%,
    rgba(30, 160, 150, 0.03) 35%,
    transparent 70%
  );
  top: 15%; left: 45%;
  animation: nebula-drift 20s ease-in-out infinite alternate;
  animation-delay: -4s;
}

@keyframes nebula-drift {
  0%   { transform: translate(0, 0); }
  33%  { transform: translate(30rpx, -20rpx); }
  66%  { transform: translate(-20rpx, 25rpx); }
  100% { transform: translate(15rpx, -10rpx); }
}

/* ── Constellation lines (SVG) ── */
.constellation-lines {
  position: fixed;
  inset: 0;
  width: 750rpx;
  height: 1100rpx;
  z-index: 1;
  pointer-events: none;
}
.c-line {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 0.6;
  stroke-dasharray: 3 6;
  animation: line-pulse 5s ease-in-out infinite alternate;
}
@keyframes line-pulse {
  0% { stroke-opacity: 0.3; }
  100% { stroke-opacity: 0.6; }
}

/* ── Soft-focus light dots ── */
.star-soft {
  position: absolute;
  border-radius: 50%;
  animation: soft-pulse ease-in-out infinite alternate;
  will-change: opacity, transform;
}
@keyframes soft-pulse {
  0%   { transform: scale(1); opacity: inherit; }
  100% { transform: scale(1.5); opacity: 0.05; }
}
.star-soft:nth-child(odd)  { animation-duration: 3s; }
.star-soft:nth-child(even) { animation-duration: 4.5s; }

/* ── Cross sparkle stars ── */
.star-cross {
  position: absolute;
  animation: cross-twinkle ease-in-out infinite alternate;
  will-change: opacity, transform;
  display: flex; align-items: center; justify-content: center;
}
.star-cross-h, .star-cross-v {
  position: absolute;
  background: #FFFFFF;
  border-radius: 1rpx;
}
.star-cross-h {
  width: 300%; height: 2rpx;
  box-shadow:
    0 0 3rpx 1rpx rgba(255, 255, 255, 0.7),
    0 0 6rpx 2rpx rgba(200, 180, 255, 0.4),
    0 0 12rpx 3rpx rgba(200, 160, 255, 0.15);
}
.star-cross-v {
  width: 2rpx; height: 300%;
  box-shadow:
    0 0 3rpx 1rpx rgba(255, 255, 255, 0.7),
    0 0 6rpx 2rpx rgba(200, 180, 255, 0.4),
    0 0 12rpx 3rpx rgba(200, 160, 255, 0.15);
}
@keyframes cross-twinkle {
  0%   { transform: scale(0.6) rotate(0deg); opacity: 0.2; }
  50%  { transform: scale(1.1) rotate(15deg); opacity: 0.9; }
  100% { transform: scale(0.7) rotate(30deg); opacity: 0.3; }
}

/* ── Tiny distant dots ── */
.star-dot {
  position: absolute;
  width: 2rpx; height: 2rpx;
  background: #FFFFFF;
  border-radius: 50%;
  animation: dot-flicker ease-in-out infinite alternate;
}
.star-dot:nth-child(odd)  { animation-duration: 4s; }
.star-dot:nth-child(even) { animation-duration: 5.5s; }
.star-dot:nth-child(3n)   { animation-duration: 3.5s; }
@keyframes dot-flicker {
  0%   { opacity: 0.1; }
  100% { opacity: 0.5; }
}

/* ── Meteors ── */
.meteor {
  position: absolute;
  width: 2rpx;
  height: 90rpx;
  background: linear-gradient(to bottom,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.5) 25%,
    rgba(200, 180, 255, 0.2) 60%,
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
  5% { opacity: 0.9; }
  12% {
    opacity: 0;
    transform: rotate(-35deg) translateX(-240rpx) translateY(240rpx);
  }
  100% {
    opacity: 0;
    transform: rotate(-35deg) translateX(-240rpx) translateY(240rpx);
  }
}

/* ── Bottom mist ── */
.mist-bottom {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 220rpx;
  background: radial-gradient(ellipse 70% 100% at 50% 100%,
    rgba(60, 20, 80, 0.45) 0%,
    rgba(40, 15, 60, 0.25) 40%,
    transparent 70%
  );
  pointer-events: none;
}

/* ── Edge blur overlays ── */
.edge-blur {
  position: fixed; pointer-events: none; z-index: 2;
}
.edge-blur--top {
  top: 0; left: 0; right: 0; height: 80rpx;
  background: linear-gradient(180deg,
    rgba(11, 11, 46, 0.3) 0%,
    transparent 100%
  );
}
.edge-blur--left {
  top: 0; left: 0; bottom: 0; width: 40rpx;
  background: linear-gradient(90deg,
    rgba(11, 11, 46, 0.2) 0%,
    transparent 100%
  );
}
.edge-blur--right {
  top: 0; right: 0; bottom: 0; width: 40rpx;
  background: linear-gradient(270deg,
    rgba(11, 11, 46, 0.2) 0%,
    transparent 100%
  );
}
</style>
