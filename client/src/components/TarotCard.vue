<template>
  <view
    class="tarot-card-container"
    :class="{ 'is-flipped': flipped }"
    @click.stop="$emit('tap')"
  >
    <view class="tarot-card-inner">
      <!-- Card Back -->
      <view class="tarot-face tarot-back">
        <view class="back-ornament-top" />
        <view class="back-pattern">
          <view class="back-lines" />
          <view class="back-star">✧</view>
        </view>
        <view class="back-ornament-bottom" />
        <view class="back-border-inner" />
      </view>
      <!-- Card Front -->
      <view class="tarot-face tarot-front">
        <view class="front-border-top" />
        <view class="front-frame">
          <text class="front-number">{{ card.number || '' }}</text>
          <text class="front-name">{{ card.name }}</text>
          <text class="front-symbol">{{ card.symbol }}</text>
          <text class="front-meaning">{{ card.meaning }}</text>
        </view>
        <view class="front-border-bottom" />
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  card: {
    type: Object,
    default: () => ({ name: '?', symbol: '✦', meaning: '', number: '' })
  },
  flipped: { type: Boolean, default: false }
});

defineEmits(['tap']);
</script>

<style lang="scss" scoped>
/* Container with perspective */
.tarot-card-container {
  width: 200rpx;
  height: 340rpx;
  perspective: 800rpx;
  cursor: pointer;
}

.tarot-card-inner {
  width: 100%; height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-flipped .tarot-card-inner {
  transform: rotateY(180deg);
}

/* Shared face styles */
.tarot-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 12rpx;
  overflow: hidden;
}

/* --- Card Back (vintage engraved) --- */
.tarot-back {
  background:
    /* Fine horizontal paper lines */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3rpx,
      rgba(255,255,255,0.015) 3rpx,
      rgba(255,255,255,0.015) 4rpx
    ),
    /* Age-darkened vignette */
    radial-gradient(ellipse at center,
      rgba(42, 31, 20, 0.3) 0%,
      transparent 55%,
      rgba(0,0,0,0.55) 100%
    ),
    /* Parchment base */
    linear-gradient(160deg, #2a1f14 0%, #1a1210 40%, #241a12 100%);
  border: 3rpx solid transparent;
  background-clip: padding-box;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12rpx;
    padding: 3rpx;
    background: linear-gradient(135deg,
      rgba(180, 140, 80, 0.5),
      rgba(100, 70, 30, 0.7),
      rgba(180, 140, 80, 0.4)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}

.back-ornament-top,
.back-ornament-bottom {
  height: 30rpx;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 6rpx,
    rgba(180,140,80,0.2) 6rpx,
    rgba(180,140,80,0.2) 8rpx
  );
}

.back-pattern {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: calc(100% - 60rpx);
}

.back-lines {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 8rpx,
      rgba(180,140,80,0.08) 8rpx,
      rgba(180,140,80,0.08) 10rpx
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 8rpx,
      rgba(180,140,80,0.08) 8rpx,
      rgba(180,140,80,0.08) 10rpx
    );
}

.back-star {
  font-size: 48rpx;
  color: rgba(200, 160, 100, 0.75);
  text-shadow: 0 0 16rpx rgba(200, 160, 100, 0.3);
  position: relative;
  z-index: 1;
}

.back-border-inner {
  position: absolute;
  inset: 12rpx;
  border: 1rpx solid rgba(180, 140, 80, 0.15);
  border-radius: 6rpx;
  pointer-events: none;
}

/* --- Card Front --- */
.tarot-front {
  background:
    radial-gradient(ellipse at center,
      rgba(30, 16, 40, 0.3) 0%,
      transparent 50%,
      rgba(0,0,0,0.5) 100%
    ),
    linear-gradient(170deg, #1a1028 0%, #120d20 50%, #1a1028 100%);
  border: 3rpx solid transparent;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12rpx;
    padding: 3rpx;
    background: linear-gradient(135deg,
      rgba(139, 125, 186, 0.5),
      rgba(107, 91, 154, 0.6),
      rgba(139, 125, 186, 0.4)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}

.front-border-top,
.front-border-bottom {
  height: 20rpx;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 4rpx,
    rgba(139,125,186,0.15) 4rpx,
    rgba(139,125,186,0.15) 5rpx
  );
}

.front-frame {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24rpx 12rpx;
  position: relative;
  z-index: 1;
}

.front-number {
  font-size: 28rpx;
  color: rgba(180, 160, 200, 0.5);
  margin-bottom: 8rpx;
}

.front-name {
  font-size: 22rpx;
  color: #D4A574;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16rpx;
  line-height: 1.3;
}

.front-symbol {
  font-size: 56rpx;
  margin-bottom: 16rpx;
  filter: drop-shadow(0 0 10rpx rgba(212,165,116,0.3));
}

.front-meaning {
  font-size: 18rpx;
  color: #8888AA;
  text-align: center;
  line-height: 1.4;
}
</style>
