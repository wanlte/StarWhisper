<template>
  <view class="tarot-entry glass-card" @click="$emit('click')">
    <!-- Fanned card backs decoration -->
    <view class="entry-cards-decoration">
      <view class="fanned-card fanned-card--left" />
      <view class="fanned-card fanned-card--center" />
      <view class="fanned-card fanned-card--right" />
    </view>
    <!-- Text -->
    <view class="entry-text">
      <text class="entry-icon">✨</text>
      <text class="entry-title">塔罗占卜</text>
      <text class="entry-sub">翻一张牌 · 聆听星空的指引</text>
    </view>
    <!-- Arrow -->
    <text class="entry-arrow">→</text>

    <!-- Floating sparkles -->
    <view class="sparkle s1" />
    <view class="sparkle s2" />
    <view class="sparkle s3" />
  </view>
</template>

<script setup>
defineEmits(['click']);
</script>

<style lang="scss" scoped>
.tarot-entry {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  margin: 0 32rpx;
  cursor: pointer;
  overflow: visible;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.tarot-entry:active {
  transform: scale(0.97);
  border-color: rgba(212, 165, 116, 0.45);
  box-shadow: inset 0 1rpx 0 rgba(255,255,255,0.06),
              0 0 30rpx rgba(212, 165, 116, 0.2),
              0 8rpx 40rpx rgba(0,0,0,0.4);
}

/* Fanned card backs decoration */
.entry-cards-decoration {
  position: relative;
  width: 120rpx;
  height: 140rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.fanned-card {
  position: absolute;
  width: 72rpx;
  height: 110rpx;
  border-radius: 8rpx;
  background:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 5rpx,
      rgba(180,140,80,0.08) 5rpx,
      rgba(180,140,80,0.08) 6rpx
    ),
    linear-gradient(160deg, #2a1f14, #1a1210);
  border: 1.5rpx solid rgba(180,140,80,0.25);
}

.fanned-card--left {
  transform: rotate(-12deg);
  left: 0;
  top: 16rpx;
}
.fanned-card--center {
  transform: rotate(0deg);
  left: 24rpx;
  top: 8rpx;
  z-index: 1;
}
.fanned-card--right {
  transform: rotate(12deg);
  left: 48rpx;
  top: 16rpx;
}

/* Text */
.entry-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.entry-icon {
  font-size: 28rpx;
  margin-bottom: 4rpx;
}

.entry-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #F0E6FF;
  margin-bottom: 4rpx;
}

.entry-sub {
  font-size: 20rpx;
  color: #8888AA;
}

.entry-arrow {
  font-size: 36rpx;
  color: rgba(212, 165, 116, 0.5);
  margin-left: 12rpx;
}

/* Floating sparkles */
.sparkle {
  position: absolute;
  width: 4rpx;
  height: 4rpx;
  background: #F0C99A;
  border-radius: 50%;
  pointer-events: none;
  animation: sparkle-float 3s ease-in-out infinite;
}
.s1 { top: 20%; right: 28rpx; animation-delay: 0s; }
.s2 { top: 60%; right: 60rpx; animation-delay: 1s; }
.s3 { bottom: 25%; right: 40rpx; animation-delay: 2s; }

@keyframes sparkle-float {
  0%, 100% { opacity: 0; transform: translateY(0); }
  50% { opacity: 0.9; transform: translateY(-16rpx); }
}
</style>
