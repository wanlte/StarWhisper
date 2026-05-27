<template>
  <view class="carousel">
    <view
      class="carousel-track"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <view
        v-for="(z, i) in zodiacs"
        :key="z.id"
        class="carousel-card"
        :class="[
          cardTheme(i),
          {
            'is-center': isCenter(i),
            'is-selected': selectMode && firstPickIdx === i,
            'is-dimming': selectMode && firstPickIdx !== null && firstPickIdx !== i,
            'is-hidden': !isVisible(i)
          }
        ]"
        :style="cardStyle(i)"
        :data-index="i"
        @click="onCardTap"
      >
        <view class="card-glass-surface" />
        <view class="card-glow-ring" />
        <view class="card-top-highlight" />
        <text class="card-emoji">{{ z.emoji }}</text>
        <text class="card-name">{{ z.name }}</text>
        <view v-if="selectMode && firstPickIdx === i" class="selected-badge">
          <text>已选</text>
        </view>
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

const emit = defineEmits(['select', 'selectFirst', 'selectSecond']);

const centerIndex = ref(0);
const dragOffset = ref(0);
const firstPickIdx = ref(null);
const isDragging = ref(false);
let touchStartX = 0;

const TOTAL = computed(() => props.zodiacs.length);
const stepAngle = computed(() => TOTAL.value > 0 ? 360 / TOTAL.value : 30);
const FAN_HALF = 75;

function toRad(deg) { return deg * Math.PI / 180; }

function cardTheme(i) {
  return i % 2 === 0 ? 'card--cool' : 'card--warm';
}

function angleDiff(i) {
  if (TOTAL.value === 0) return 0;
  const center = centerIndex.value + dragOffset.value;
  let diff = i - center;
  diff = ((diff % TOTAL.value) + TOTAL.value) % TOTAL.value;
  if (diff > TOTAL.value / 2) diff -= TOTAL.value;
  return diff;
}

function isVisible(i) {
  if (TOTAL.value === 0) return false;
  const diff = angleDiff(i);
  return Math.abs(diff * stepAngle.value) <= FAN_HALF + 5;
}

function isCenter(i) {
  if (TOTAL.value === 0) return false;
  return Math.abs(angleDiff(i)) < 0.55;
}

function cardStyle(i) {
  if (TOTAL.value === 0) return { display: 'none' };

  const diff = angleDiff(i);
  const angleDeg = diff * stepAngle.value;
  const absAngle = Math.abs(angleDeg);

  if (absAngle > FAN_HALF + 5) {
    return { display: 'none' };
  }

  const angleRad = toRad(angleDeg);
  const cosVal = Math.cos(angleRad);
  const sinVal = Math.sin(angleRad);

  // Full-width ellipse for centered vertical layout
  const cx = 250;
  const cy = 260;
  const a = 240;
  const b = 210;

  const x = cx + a * cosVal;
  const y = cy + b * sinVal;

  const dist = Math.min(absAngle / FAN_HALF, 1);
  const scale = 1.0 - 0.48 * dist * dist;
  const opacity = 1.0 - 0.6 * dist * dist;
  const tilt = sinVal * 12 * (1 - dist * 0.6);
  const zIdx = Math.round(18 - 16 * dist);

  return {
    left: x + 'rpx',
    top: y + 'rpx',
    transform: `translate(-50%, -50%) scale(${scale}) rotateZ(${tilt}deg)`,
    opacity: opacity,
    zIndex: zIdx,
    transition: isDragging.value
      ? 'none'
      : 'left 0.55s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.55s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.55s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.35s ease-out'
  };
}

// ── Touch ──

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  isDragging.value = true;
  dragOffset.value = 0;
}

function onTouchMove(e) {
  if (!isDragging.value) return;
  const dx = e.touches[0].clientX - touchStartX;
  dragOffset.value = dx / 60;
}

function onTouchEnd() {
  isDragging.value = false;
  if (TOTAL.value === 0) return;
  const total = centerIndex.value + dragOffset.value;
  centerIndex.value = Math.round(total);
  centerIndex.value = ((centerIndex.value % TOTAL.value) + TOTAL.value) % TOTAL.value;
  dragOffset.value = 0;
}

// ── Tap ──

function onCardTap(e) {
  const i = e.currentTarget.dataset.index;
  if (i === undefined || !props.zodiacs[i]) return;
  const z = props.zodiacs[i];
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
  width: 750rpx;
  max-width: 100%;
  position: relative;
  z-index: 2;
}

.carousel-track {
  position: relative;
  width: 750rpx;
  max-width: 100%;
  height: 580rpx;
  overflow: hidden;
}

/* ── Card base ── */
.carousel-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 130rpx;
  min-height: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18rpx 6rpx 14rpx;
  border-radius: 20rpx;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(160deg,
    rgba(75, 40, 120, 0.48) 0%,
    rgba(45, 20, 80, 0.52) 50%,
    rgba(60, 30, 100, 0.44) 100%
  );
  border: 1.2rpx solid rgba(180, 150, 220, 0.28);
  box-shadow:
    0 0 8rpx rgba(160, 130, 210, 0.12),
    0 4rpx 20rpx rgba(0, 0, 0, 0.35);
}

.carousel-card.is-hidden {
  display: none;
}

/* Inner glass surface */
.card-glass-surface {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.04) 0%,
    transparent 35%,
    rgba(0, 0, 0, 0.08) 100%
  );
  border-radius: 22rpx;
}

/* Top highlight line */
.card-top-highlight {
  position: absolute;
  top: 1rpx;
  left: 14rpx;
  right: 14rpx;
  height: 1rpx;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.12) 30%,
    rgba(255, 255, 255, 0.08) 70%,
    transparent 100%
  );
  z-index: 3;
  pointer-events: none;
  border-radius: 1rpx;
}

/* Cool theme */
.card--cool {
  border-color: rgba(150, 160, 225, 0.32);
  background: linear-gradient(160deg,
    rgba(35, 25, 90, 0.5) 0%,
    rgba(25, 18, 70, 0.54) 50%,
    rgba(40, 28, 85, 0.46) 100%
  );
}

/* Warm theme */
.card--warm {
  border-color: rgba(215, 145, 195, 0.32);
  background: linear-gradient(160deg,
    rgba(65, 25, 80, 0.5) 0%,
    rgba(45, 18, 60, 0.54) 50%,
    rgba(55, 22, 72, 0.46) 100%
  );
}

/* Glow ring */
.card-glow-ring {
  position: absolute;
  top: 2rpx;
  right: 2rpx;
  bottom: 2rpx;
  left: 2rpx;
  border-radius: 20rpx;
  border: 1rpx solid rgba(200, 180, 230, 0.08);
  pointer-events: none;
  z-index: 1;
}

/* ── Center card ── */
.carousel-card.is-center {
  width: 160rpx;
  min-height: 210rpx;
  border-color: rgba(220, 195, 240, 0.55);
  background: linear-gradient(160deg,
    rgba(90, 50, 140, 0.55) 0%,
    rgba(55, 25, 95, 0.58) 50%,
    rgba(70, 38, 115, 0.5) 100%
  );
  box-shadow:
    0 0 3rpx rgba(255, 255, 255, 0.35),
    0 0 24rpx rgba(170, 140, 215, 0.30),
    0 0 48rpx rgba(140, 110, 200, 0.14),
    0 6rpx 32rpx rgba(0, 0, 0, 0.42);
}

.carousel-card.is-center .card-glow-ring {
  border-color: rgba(220, 200, 240, 0.18);
}

.carousel-card.is-center .card-top-highlight {
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 25%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 100%
  );
}

.carousel-card.is-center.card--cool {
  border-color: rgba(180, 200, 255, 0.55);
  box-shadow:
    0 0 4rpx rgba(255, 255, 255, 0.4),
    0 0 28rpx rgba(110, 150, 225, 0.32),
    0 0 50rpx rgba(90, 120, 210, 0.14),
    0 6rpx 32rpx rgba(0, 0, 0, 0.42);
}

.carousel-card.is-center.card--warm {
  border-color: rgba(240, 180, 215, 0.55);
  box-shadow:
    0 0 4rpx rgba(255, 255, 255, 0.4),
    0 0 28rpx rgba(210, 130, 180, 0.32),
    0 0 50rpx rgba(190, 110, 160, 0.14),
    0 6rpx 32rpx rgba(0, 0, 0, 0.42);
}

/* ── Selection states ── */
.carousel-card.is-selected {
  border-color: rgba(232, 213, 176, 0.75) !important;
  box-shadow:
    0 0 4rpx rgba(255, 255, 255, 0.45),
    0 0 32rpx rgba(232, 213, 176, 0.4),
    0 0 55rpx rgba(212, 165, 116, 0.14),
    0 6rpx 30rpx rgba(0, 0, 0, 0.4) !important;
}

.carousel-card.is-dimming {
  opacity: 0.22 !important;
}

/* ── Content ── */
.card-emoji {
  font-size: 52rpx;
  margin-bottom: 6rpx;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 12rpx rgba(255, 255, 255, 0.22);
}

.is-center .card-emoji {
  font-size: 64rpx;
  text-shadow: 0 0 18rpx rgba(255, 255, 255, 0.35);
}

.card-name {
  font-size: 20rpx;
  color: #DDD;
  font-weight: 600;
  position: relative;
  z-index: 2;
  text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.4);
}

.is-center .card-name {
  font-size: 24rpx;
  background: linear-gradient(180deg, #FFE8D0, #E0D0B8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── Selected badge ── */
.selected-badge {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  background: linear-gradient(135deg, #E8D5B0, #C8A882);
  border-radius: 14rpx;
  padding: 2rpx 12rpx;
  font-size: 16rpx;
  color: #1a1a2e;
  font-weight: bold;
  z-index: 5;
}
</style>
