<template>
  <view class="tarot-panel">
    <!-- Panel star texture -->
    <view class="panel-star-texture">
      <view v-for="n in 8" :key="'ps-'+n" class="panel-star-dot"
        :style="{
          left: (5 + ((n * 31 + 7) % 80)) + '%',
          top: (4 + ((n * 19 + 11) % 85)) + '%',
          animationDelay: ((n * 0.4) % 3) + 's'
        }"
      />
    </view>

    <!-- Title badge -->
    <view class="tarot-title-badge">
      <text class="tarot-title-text">塔罗占卜</text>
    </view>

    <!-- Tarot card display -->
    <view class="tarot-card-stage">
      <!-- Mist layers -->
      <view class="mist mist--left" />
      <view class="mist mist--right" />
      <view class="mist mist--bottom" />

      <!-- The card -->
      <view class="tarot-display-card">
        <view class="display-card-glow" />
        <!-- 8-pointed cross star -->
        <view class="magic-star">
          <view class="magic-star-arm magic-star-arm--h" />
          <view class="magic-star-arm magic-star-arm--v" />
          <view class="magic-star-arm magic-star-arm--d1" />
          <view class="magic-star-arm magic-star-arm--d2" />
          <view class="magic-star-core" />
        </view>
        <text class="display-card-label">塔罗牌</text>
        <view class="magic-ring" />
      </view>
    </view>

    <!-- Draw button -->
    <view class="tarot-draw-btn" @click="$emit('draw', 'regular')">
      <text class="tarot-draw-btn-text">占卜</text>
    </view>
  </view>
</template>

<script setup>
defineEmits(['draw']);
</script>

<style lang="scss" scoped>
.tarot-panel {
  position: relative;
  background: linear-gradient(170deg,
    rgba(25, 10, 55, 0.62) 0%,
    rgba(18, 8, 42, 0.66) 50%,
    rgba(28, 12, 52, 0.58) 100%
  );
  border-radius: 22rpx;
  border: 1.2rpx solid rgba(200, 160, 220, 0.32);
  box-shadow:
    0 0 12rpx rgba(170, 130, 210, 0.15),
    0 0 30rpx rgba(150, 110, 190, 0.08),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.03);
  padding: 18rpx 10rpx 16rpx;
  display: flex; flex-direction: column; align-items: center;
  overflow: hidden;
  width: 100%;
}

.panel-star-texture {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
}
.panel-star-dot {
  position: absolute;
  width: 2rpx; height: 2rpx;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  animation: panel-star-flicker 3s ease-in-out infinite alternate;
}
@keyframes panel-star-flicker {
  0% { opacity: 0.06; }
  100% { opacity: 0.25; }
}

.tarot-title-badge {
  position: relative; z-index: 2;
  background: rgba(255, 255, 255, 0.88);
  border: 1rpx solid rgba(180, 150, 210, 0.35);
  border-radius: 12rpx;
  padding: 6rpx 16rpx;
  margin-bottom: 14rpx;
  box-shadow:
    0 0 8rpx rgba(200, 170, 230, 0.18),
    0 1rpx 6rpx rgba(0, 0, 0, 0.12);
}
.tarot-title-text {
  font-size: 20rpx;
  font-weight: bold;
  color: #3D2670;
  letter-spacing: 1rpx;
}

.tarot-card-stage {
  position: relative; z-index: 2;
  width: 140rpx; height: 200rpx;
  margin-bottom: 16rpx;
}

.mist {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: mist-drift ease-in-out infinite alternate;
}
.mist--left {
  width: 60rpx; height: 70rpx;
  background: radial-gradient(ellipse at center,
    rgba(200, 180, 230, 0.1) 0%,
    rgba(180, 150, 210, 0.04) 40%,
    transparent 70%
  );
  left: -18rpx; top: 36rpx;
  animation-duration: 3.5s;
}
.mist--right {
  width: 55rpx; height: 65rpx;
  background: radial-gradient(ellipse at center,
    rgba(190, 170, 220, 0.08) 0%,
    rgba(170, 140, 200, 0.03) 40%,
    transparent 70%
  );
  right: -14rpx; top: 30rpx;
  animation-duration: 4s; animation-delay: 0.5s;
}
.mist--bottom {
  width: 70rpx; height: 45rpx;
  background: radial-gradient(ellipse at center,
    rgba(210, 190, 235, 0.08) 0%,
    rgba(190, 160, 220, 0.03) 40%,
    transparent 70%
  );
  bottom: -10rpx; left: 35rpx;
  animation-duration: 4.5s; animation-delay: 1s;
}
@keyframes mist-drift {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(5rpx, -4rpx) scale(1.05); }
  66%  { transform: translate(-4rpx, 5rpx) scale(0.97); }
  100% { transform: translate(2rpx, -2rpx) scale(1.02); }
}

.tarot-display-card {
  position: absolute;
  inset: 14rpx 10rpx;
  border-radius: 14rpx;
  background: linear-gradient(170deg, #1E1450 0%, #2B1F60 45%, #3D2670 100%);
  border: 1rpx solid rgba(200, 170, 230, 0.28);
  box-shadow:
    0 0 8rpx rgba(180, 150, 220, 0.18),
    0 3rpx 20rpx rgba(0, 0, 0, 0.3);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  overflow: hidden;
  z-index: 2;
}
.display-card-glow {
  position: absolute; inset: 3rpx;
  border-radius: 12rpx;
  border: 1rpx solid rgba(200, 170, 230, 0.1);
  pointer-events: none; z-index: 1;
}

/* 8-pointed cross star */
.magic-star {
  position: relative;
  width: 54rpx; height: 54rpx;
  z-index: 2;
  display: flex; align-items: center; justify-content: center;
}
.magic-star-arm {
  position: absolute;
  background: linear-gradient(90deg,
    transparent 20%,
    rgba(255, 255, 255, 0.6) 40%,
    rgba(240, 220, 255, 0.7) 50%,
    rgba(255, 255, 255, 0.6) 60%,
    transparent 80%
  );
  box-shadow:
    0 0 3rpx rgba(255, 255, 255, 0.4),
    0 0 6rpx rgba(200, 180, 240, 0.2);
  border-radius: 1rpx;
}
.magic-star-arm--h {
  width: 58rpx; height: 1.5rpx; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
.magic-star-arm--v {
  width: 1.5rpx; height: 58rpx; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
.magic-star-arm--d1 {
  width: 48rpx; height: 1.5rpx; top: 50%; left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}
.magic-star-arm--d2 {
  width: 48rpx; height: 1.5rpx; top: 50%; left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}
.magic-star-core {
  width: 8rpx; height: 8rpx;
  background: #FFF;
  border-radius: 50%;
  box-shadow:
    0 0 5rpx 2rpx rgba(255, 255, 255, 0.5),
    0 0 10rpx 4rpx rgba(200, 180, 240, 0.25);
  z-index: 3;
  animation: core-glow 2s ease-in-out infinite alternate;
}
@keyframes core-glow {
  0% { transform: scale(1); box-shadow: 0 0 5rpx 2rpx rgba(255,255,255,0.45), 0 0 10rpx 3rpx rgba(200,180,240,0.2); }
  100% { transform: scale(1.15); box-shadow: 0 0 6rpx 3rpx rgba(255,255,255,0.65), 0 0 14rpx 5rpx rgba(200,180,240,0.3); }
}

.magic-ring {
  position: absolute;
  width: 64rpx; height: 64rpx;
  border-radius: 50%;
  border: 1rpx solid rgba(200, 170, 230, 0.12);
  box-shadow: 0 0 6rpx rgba(180, 150, 220, 0.06);
  z-index: 1;
  animation: ring-rotate 12s linear infinite;
}
@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.display-card-label {
  font-size: 14rpx;
  color: rgba(220, 200, 240, 0.6);
  margin-top: 6rpx;
  z-index: 2;
  letter-spacing: 3rpx;
  text-shadow: 0 0 5rpx rgba(180, 150, 220, 0.2);
}

/* Draw button */
.tarot-draw-btn {
  position: relative; z-index: 2;
  width: 100%;
  padding: 14rpx 0;
  border-radius: 22rpx;
  background: linear-gradient(135deg, #5540A0 0%, #7B4B9A 50%, #A85A8A 100%);
  border: 1rpx solid rgba(220, 180, 230, 0.28);
  box-shadow:
    0 0 10rpx rgba(160, 120, 200, 0.2),
    0 3rpx 14rpx rgba(0, 0, 0, 0.28),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.05);
  cursor: pointer;
  text-align: center;
  transition: transform 0.15s, box-shadow 0.15s;
}
.tarot-draw-btn:active {
  transform: scale(0.95);
  box-shadow:
    0 0 14rpx rgba(180, 140, 220, 0.3),
    0 3rpx 14rpx rgba(0, 0, 0, 0.28),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.05);
}
.tarot-draw-btn-text {
  font-size: 24rpx;
  font-weight: bold;
  color: #F0E6FF;
  text-shadow: 0 0 6rpx rgba(220, 200, 240, 0.2);
  letter-spacing: 5rpx;
}
</style>
