<template>
  <view class="carousel">
    <!-- Arc track -->
    <view
      class="carousel-track"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <view
        v-for="(z, i) in zodiacs"
        :key="z.id"
        class="carousel-card glass-card"
        :class="[
          elementClass(z.element),
          {
            'is-center': isCenter(i),
            'is-selected': selectMode && firstPickIdx === i,
            'is-dimming': selectMode && firstPickIdx !== null && firstPickIdx !== i && !isCenter(i)
          }
        ]"
        :style="cardStyle(i)"
        @click.stop="handleTap(z, i)"
      >
        <!-- Star pattern background -->
        <view class="card-stars">
          <view v-for="n in 8" :key="n" class="card-star-dot"
            :style="{
              left: (15 + Math.random() * 70) + '%',
              top: (10 + Math.random() * 80) + '%',
              opacity: 0.15 + Math.random() * 0.3,
              animationDelay: Math.random() * 2 + 's'
            }"
          />
        </view>
        <!-- Directional light -->
        <view class="card-highlight" />
        <!-- Card border glow layer -->
        <view class="card-glow-ring" />
        <!-- Content -->
        <text class="card-emoji">{{ z.emoji }}</text>
        <text class="card-name">{{ z.name }}</text>
        <text class="card-en">{{ z.nameEn }}</text>
        <text v-if="isCenter(i)" class="card-element">{{ z.element }} · {{ z.rulingPlanet }}</text>
        <!-- Selected badge -->
        <view v-if="selectMode && firstPickIdx === i" class="selected-badge">
          <text>已选</text>
        </view>
      </view>
    </view>

    <!-- Dot indicators -->
    <view class="carousel-dots">
      <view
        v-for="(z, i) in zodiacs" :key="'dot-'+z.id"
        class="dot" :class="{ active: centerIndex === i }"
        @click.stop="snapTo(i)"
      />
    </view>

    <!-- Mode toggle -->
    <view class="carousel-tools">
      <view
        v-if="!selectMode"
        class="mode-toggle glass-card-interactive"
        @click.stop="$emit('toggleSelectMode')"
      >
        <text class="toggle-icon">🔮</text>
        <text class="toggle-text">双选配对</text>
      </view>
      <view v-else class="mode-toggle mode-toggle--active" @click.stop="$emit('toggleSelectMode')">
        <text class="toggle-icon">✕</text>
        <text class="toggle-text">取消配对</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  zodiacs: { type: Array, required: true },
  selectMode: { type: Boolean, default: false }
});

const emit = defineEmits([
  'select', 'selectFirst', 'selectSecond', 'toggleSelectMode'
]);

const centerIndex = ref(0);
const dragOffset = ref(0);
const firstPickIdx = ref(null);
const isDragging = ref(false);
let touchStartX = 0;
let touchStartCenter = 0;

const TOTAL = computed(() => props.zodiacs.length);
const STEP_ANGLE = 22;

function toRad(deg) { return deg * Math.PI / 180; }

// Map element to color class
function elementClass(element) {
  if (!element) return 'card--fire';
  if (element === '火象' || element === '风象') return 'card--fire';
  return 'card--water';
}

function cardStyle(i) {
  const center = centerIndex.value;
  const offset = dragOffset.value;
  const effIdx = i - (center + offset);
  const angleDeg = effIdx * STEP_ANGLE;
  const angleRad = toRad(angleDeg);
  const cosVal = Math.cos(angleRad);
  const sinVal = Math.sin(angleRad);

  const arcRadius = 380;
  const xOffset = sinVal * arcRadius;
  const yOffset = (1 - Math.abs(cosVal)) * 60;
  const scale = 0.52 + 0.48 * Math.abs(cosVal);
  const opacity = 0.25 + 0.75 * Math.abs(cosVal);
  const zIdx = Math.round(10 + cosVal * 9);
  const rotY = angleDeg * 0.3;
  const isHidden = Math.abs(angleDeg) > 105;

  return {
    transform: `translateX(${xOffset}rpx) translateY(${yOffset}rpx) scale(${scale}) rotateY(${rotY}deg)`,
    opacity: isHidden ? 0 : opacity,
    zIndex: isHidden ? 0 : zIdx,
    pointerEvents: isHidden ? 'none' : 'auto',
    transition: isDragging.value ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.35s ease-out'
  };
}

function isCenter(i) {
  return Math.abs(i - centerIndex.value - dragOffset.value) < 0.6;
}

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartCenter = centerIndex.value;
  isDragging.value = true;
  dragOffset.value = 0;
}

function onTouchMove(e) {
  if (!isDragging.value) return;
  const dx = e.touches[0].clientX - touchStartX;
  dragOffset.value = -(dx / 80);
}

function onTouchEnd() {
  isDragging.value = false;
  const total = centerIndex.value + dragOffset.value;
  centerIndex.value = Math.round(total);
  if (centerIndex.value < 0) centerIndex.value = TOTAL.value - 1;
  if (centerIndex.value >= TOTAL.value) centerIndex.value = 0;
  dragOffset.value = 0;
}

function snapTo(i) {
  centerIndex.value = i;
  dragOffset.value = 0;
}

function handleTap(z, i) {
  if (!isCenter(i)) {
    snapTo(i);
    return;
  }
  if (props.selectMode) {
    if (firstPickIdx.value === null) {
      firstPickIdx.value = i;
      emit('selectFirst', z);
    } else if (firstPickIdx.value === i) {
      firstPickIdx.value = null;
    } else {
      emit('selectSecond', z);
      firstPickIdx.value = null;
    }
  } else {
    emit('select', z);
  }
}

watch(() => props.selectMode, (v) => {
  if (!v) firstPickIdx.value = null;
});
</script>

<style lang="scss" scoped>
.carousel {
  position: relative; z-index: 2;
  padding-top: 20rpx; padding-bottom: 16rpx;
}

.carousel-track {
  position: relative; height: 480rpx;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}

.carousel-card {
  position: absolute;
  width: 160rpx; min-height: 240rpx;
  display: flex; flex-direction: column; align-items: center;
  padding: 28rpx 16rpx 24rpx;
  will-change: transform, opacity;
  cursor: pointer;
  overflow: hidden;
}

/* Card star pattern */
.card-stars {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
}
.card-star-dot {
  position: absolute;
  width: 3rpx; height: 3rpx;
  background: #FFF; border-radius: 50%;
  animation: card-star-twinkle 2.5s ease-in-out infinite alternate;
}

/* Element color variants */
.carousel-card.card--fire {
  border-color: rgba(196, 77, 142, 0.35);
  .card-glow-ring {
    background: linear-gradient(135deg,
      rgba(196, 77, 142, 0.2) 0%,
      rgba(123, 47, 190, 0.15) 50%,
      rgba(196, 77, 142, 0.1) 100%
    );
  }
}
.carousel-card.card--water {
  border-color: rgba(59, 95, 217, 0.35);
  .card-glow-ring {
    background: linear-gradient(135deg,
      rgba(46, 196, 182, 0.2) 0%,
      rgba(59, 95, 217, 0.15) 50%,
      rgba(46, 196, 182, 0.1) 100%
    );
  }
}

/* Center card */
.carousel-card.is-center {
  width: 200rpx;
  border-color: rgba(212, 165, 116, 0.5) !important;
  box-shadow:
    0 0 2rpx rgba(255,255,255,0.3),
    0 0 30rpx rgba(212, 165, 116, 0.2),
    0 8rpx 40rpx rgba(0,0,0,0.4) !important;
  .card-glow-ring { opacity: 1; }
}

.carousel-card.is-center.card--fire {
  border-color: rgba(255, 180, 200, 0.55) !important;
  box-shadow:
    0 0 2rpx rgba(255,255,255,0.4),
    0 0 30rpx rgba(196, 77, 142, 0.3),
    0 0 50rpx rgba(123, 47, 190, 0.2),
    0 8rpx 40rpx rgba(0,0,0,0.4) !important;
}

.carousel-card.is-center.card--water {
  border-color: rgba(150, 210, 255, 0.55) !important;
  box-shadow:
    0 0 2rpx rgba(255,255,255,0.4),
    0 0 30rpx rgba(59, 95, 217, 0.3),
    0 0 50rpx rgba(46, 196, 182, 0.2),
    0 8rpx 40rpx rgba(0,0,0,0.4) !important;
}

.carousel-card.is-selected {
  border-color: rgba(212, 165, 116, 0.8) !important;
  box-shadow:
    0 0 4rpx rgba(255,255,255,0.4),
    0 0 40rpx rgba(212, 165, 116, 0.45),
    0 0 70rpx rgba(212, 165, 116, 0.15),
    0 8rpx 40rpx rgba(0,0,0,0.4) !important;
}

.carousel-card.is-dimming { opacity: 0.2 !important; }

.card-glow-ring {
  position: absolute; inset: 4rpx;
  border-radius: 20rpx; opacity: 0.4;
  pointer-events: none; z-index: 0;
  transition: opacity 0.3s;
}

.card-highlight {
  position: absolute;
  top: 0; left: 0; right: 0; height: 70%;
  border-radius: 24rpx 24rpx 50% 50%;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.08) 0%,
    rgba(255,255,255,0.03) 40%,
    transparent 100%
  );
  pointer-events: none; z-index: 2;
}

.card-emoji { font-size: 56rpx; margin-bottom: 8rpx; position: relative; z-index: 1; }
.is-center .card-emoji { font-size: 68rpx; }

.card-name {
  font-size: 22rpx; color: #EEE; font-weight: bold;
  position: relative; z-index: 1; margin-bottom: 4rpx;
}
.is-center .card-name {
  font-size: 26rpx;
  background: linear-gradient(180deg, #FFE0C0, #F0C99A, #D4A574);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.card-en { font-size: 16rpx; color: #888; position: relative; z-index: 1; }
.is-center .card-en { font-size: 18rpx; color: #AAA; }

.card-element {
  font-size: 18rpx; color: #C0B0D8; margin-top: 6rpx;
  position: relative; z-index: 1;
  background: rgba(139, 125, 186, 0.15);
  padding: 2rpx 16rpx; border-radius: 16rpx;
}

.selected-badge {
  position: absolute; top: 10rpx; right: 10rpx;
  background: linear-gradient(135deg, #D4A574, #F0C99A);
  border-radius: 16rpx; padding: 4rpx 14rpx;
  font-size: 18rpx; color: #1a1a2e; font-weight: bold; z-index: 5;
}

/* Dots */
.carousel-dots {
  display: flex; justify-content: center; gap: 12rpx;
  padding: 24rpx 0 8rpx;
}
.dot {
  width: 10rpx; height: 10rpx; border-radius: 50%;
  background: rgba(255,255,255,0.15);
  transition: all 0.3s; cursor: pointer;
}
.dot.active {
  background: #D4A574;
  box-shadow: 0 0 10rpx rgba(212,165,116,0.5);
  width: 24rpx; border-radius: 10rpx;
}

/* Mode toggle */
.carousel-tools {
  display: flex; justify-content: center; padding: 8rpx 0 16rpx;
}
.mode-toggle {
  display: flex; align-items: center; gap: 8rpx;
  padding: 16rpx 36rpx; border-radius: 40rpx;
  background: rgba(255,255,255,0.04);
  border: 1rpx solid rgba(255,255,255,0.1);
  transition: all 0.2s; cursor: pointer;
}
.mode-toggle:active {
  background: rgba(212,165,116,0.12);
  border-color: rgba(212,165,116,0.3);
}
.mode-toggle--active {
  background: rgba(212,165,116,0.12);
  border-color: rgba(212,165,116,0.35);
}
.toggle-icon { font-size: 32rpx; }
.toggle-text { font-size: 24rpx; color: #CCC; }

@keyframes card-star-twinkle {
  0% { opacity: 0.1; }
  100% { opacity: 0.5; }
}
</style>
