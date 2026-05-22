<template>
  <view class="char-card" :class="{ flipped }" @click="flipped = !flipped">
    <!-- Front: avatar + name -->
    <view class="card-face card-front">
      <view class="char-emoji">{{ character.emoji }}</view>
      <text class="char-name">{{ character.name }}</text>
      <text class="char-tagline">{{ character.tagline }}</text>
    </view>
    <!-- Back: concept + resonance -->
    <view class="card-face card-back">
      <text class="back-label">概念设定</text>
      <text class="back-concept">{{ character.concept }}</text>
      <text v-if="character.visualTag" class="back-visual">{{ character.visualTag }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  character: { type: Object, required: true }
});

const flipped = ref(false);
</script>

<style lang="scss" scoped>
.char-card {
  width: 320rpx; height: 400rpx;
  perspective: 1000rpx;
  position: relative;
}
.card-face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  transition: transform 0.6s;
}
.card-front {
  background: linear-gradient(160deg, #1a1a2e 0%, #2a1a3e 100%);
  border: 1rpx solid rgba(212, 165, 116, 0.25);
  transform: rotateY(0deg);
}
.card-back {
  background: linear-gradient(160deg, #16213e 0%, #1a1a2e 100%);
  border: 1rpx solid rgba(212, 165, 116, 0.3);
  transform: rotateY(180deg);
}
.flipped .card-front { transform: rotateY(180deg); }
.flipped .card-back { transform: rotateY(0deg); }

.char-emoji { font-size: 80rpx; margin-bottom: 16rpx; }
.char-name { font-size: 32rpx; font-weight: bold; color: #D4A574; margin-bottom: 12rpx; }
.char-tagline { font-size: 24rpx; color: #B0B0C0; text-align: center; line-height: 1.6; }
.back-label { font-size: 22rpx; color: #D4A574; margin-bottom: 16rpx; }
.back-concept { font-size: 24rpx; color: #B0B0C0; text-align: center; line-height: 1.7; margin-bottom: 16rpx; }
.back-visual { font-size: 22rpx; color: #707088; text-align: center; line-height: 1.5; }
</style>
