<template>
  <view class="tarot-entry-section">
    <!-- Title with star decorations -->
    <view class="tarot-section-header">
      <view class="header-line" />
      <view class="header-star">✦</view>
      <text class="header-title">塔罗占卜</text>
      <view class="header-star">✦</view>
      <view class="header-line" />
    </view>

    <!-- Interaction area -->
    <view class="tarot-interact glass-card">
      <!-- 7 fanned card backs -->
      <view class="cards-fan">
        <view
          v-for="i in 7" :key="i"
          class="fan-card"
          :style="{ transform: fanTransform(i), zIndex: i <= 4 ? 1 : 0 }"
        />
      </view>

      <!-- Revealed preview card (Temperance) -->
      <view class="revealed-preview glass-card">
        <view class="preview-border" />
        <text class="preview-symbol">🏺</text>
        <text class="preview-name">节制</text>
        <text class="preview-pos">正位</text>
      </view>

      <!-- Dual CTA buttons -->
      <view class="tarot-actions">
        <view class="tarot-btn tarot-btn--regular glass-card-interactive" @click="$emit('draw', 'regular')">
          <text class="tarot-btn-icon">🔮</text>
          <text class="tarot-btn-text">抽牌</text>
        </view>
        <view class="tarot-btn tarot-btn--premium glass-card-interactive" @click="$emit('draw', 'premium')">
          <text class="tarot-btn-icon">✨</text>
          <text class="tarot-btn-text">高级抽牌</text>
        </view>
      </view>

      <!-- Sparkles -->
      <view class="sparkle s1" /><view class="sparkle s2" />
      <view class="sparkle s3" /><view class="sparkle s4" />
    </view>
  </view>
</template>

<script setup>
defineEmits(['draw', 'click']);

function fanTransform(i) {
  const angles = [-18, -12, -6, 0, 6, 12, 18];
  const xOffsets = [-36, -24, -12, 0, 12, 24, 36];
  const idx = i - 1;
  return `rotate(${angles[idx]}deg) translateX(${xOffsets[idx]}rpx)`;
}
</script>

<style lang="scss" scoped>
.tarot-entry-section {
  position: relative; z-index: 2;
  padding: 16rpx 24rpx;
}

/* Section header */
.tarot-section-header {
  display: flex; align-items: center; justify-content: center;
  gap: 12rpx; margin-bottom: 20rpx;
}
.header-line {
  width: 40rpx; height: 1rpx;
  background: linear-gradient(90deg, transparent, rgba(212,165,116,0.4), transparent);
}
.header-star {
  font-size: 20rpx; color: #D4A574;
  animation: header-star-pulse 2.5s ease-in-out infinite;
}
.header-star:last-child { animation-delay: 1.2s; }
.header-title {
  font-size: 30rpx; font-weight: bold;
  background: linear-gradient(180deg, #F0C99A, #D4A574);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

/* Interaction card */
.tarot-interact {
  position: relative;
  padding: 32rpx 24rpx 24rpx;
  overflow: visible;
}

/* 7 fanned card backs */
.cards-fan {
  display: flex; justify-content: center; align-items: center;
  height: 120rpx; margin-bottom: 28rpx;
  position: relative;
}
.fan-card {
  position: absolute;
  width: 60rpx; height: 96rpx;
  border-radius: 6rpx;
  background:
    repeating-linear-gradient(45deg,
      transparent, transparent 4rpx,
      rgba(200,160,100,0.08) 4rpx, rgba(200,160,100,0.08) 5rpx
    ),
    linear-gradient(160deg, #2a1f14, #1a1210);
  border: 1rpx solid rgba(180,140,80,0.3);
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.3);
}

/* Revealed preview card */
.revealed-preview {
  width: 160rpx; margin: 0 auto 24rpx;
  padding: 20rpx 16rpx;
  display: flex; flex-direction: column; align-items: center;
  border-color: rgba(212,165,116,0.35);
  box-shadow: 0 0 24rpx rgba(212,165,116,0.2), 0 4rpx 24rpx rgba(0,0,0,0.3);
  position: relative; overflow: hidden;
}
.preview-border {
  position: absolute; inset: 4rpx;
  border: 1rpx solid rgba(212,165,116,0.15);
  border-radius: 20rpx; pointer-events: none;
}
.preview-symbol { font-size: 48rpx; margin-bottom: 6rpx; position: relative; z-index: 1; }
.preview-name {
  font-size: 20rpx; color: #F0E6FF; font-weight: bold;
  position: relative; z-index: 1;
}
.preview-pos {
  font-size: 16rpx; color: #D4A574; margin-top: 4rpx;
  position: relative; z-index: 1;
  background: rgba(212,165,116,0.12);
  padding: 2rpx 12rpx; border-radius: 10rpx;
}

/* Dual buttons */
.tarot-actions {
  display: flex; gap: 16rpx;
}
.tarot-btn {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 4rpx;
  padding: 18rpx 16rpx; border-radius: 20rpx;
  cursor: pointer;
}
.tarot-btn--regular {
  background: rgba(139, 125, 186, 0.12);
  border-color: rgba(139, 125, 186, 0.25);
}
.tarot-btn--premium {
  background: rgba(212, 165, 116, 0.12);
  border-color: rgba(212, 165, 116, 0.3);
  position: relative;
}
.tarot-btn--premium::after {
  content: '';
  position: absolute; inset: -1rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg,
    rgba(212,165,116,0.4), transparent 40%,
    transparent 60%, rgba(240,201,154,0.4)
  );
  pointer-events: none;
}
.tarot-btn-icon { font-size: 32rpx; }
.tarot-btn-text { font-size: 22rpx; color: #DDD; }

/* Floating sparkles */
.sparkle {
  position: absolute; width: 4rpx; height: 4rpx;
  background: #F0C99A; border-radius: 50%;
  pointer-events: none;
  animation: sparkle-float 3s ease-in-out infinite;
}
.s1 { top: 10%; right: 20%; animation-delay: 0s; }
.s2 { top: 30%; left: 12%; animation-delay: 0.8s; }
.s3 { bottom: 20%; right: 16%; animation-delay: 1.6s; }
.s4 { top: 50%; right: 10%; animation-delay: 2.4s; }

@keyframes sparkle-float {
  0%, 100% { opacity: 0; transform: translateY(0); }
  50% { opacity: 0.9; transform: translateY(-14rpx); }
}
@keyframes header-star-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
</style>
