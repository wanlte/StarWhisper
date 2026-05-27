<template>
  <view class="page-result page-bg">
    <ParticleEffect :active="showParticles" :count="40" />
    <StarryBackground />
    <LoadingWrapper :loading="!character" text="角色正在降临...">
      <template v-if="character">
        <!-- Character Reveal -->
        <view class="reveal content-layer fade-in">
          <view class="portrait-wrap">
            <CharacterPortrait :character="character" />
          </view>
          <text class="reveal-name glow-text">{{ character.name }}</text>
          <text class="reveal-tagline">「{{ character.tagline }}」</text>
        </view>
        <!-- Score -->
        <view class="score-card glass-card-glow content-layer fade-in">
          <text class="score-number">{{ scores?.total || 0 }}%</text>
          <text class="score-label">综合匹配度</text>
          <view class="score-details">
            <view class="score-item"><text class="si-label">星座契合</text><text class="si-val">{{ scores?.zodiacAffinity || 0 }}%</text></view>
            <view class="score-item"><text class="si-label">性格共鸣</text><text class="si-val">{{ scores?.quizMatch || 0 }}%</text></view>
          </view>
        </view>
        <!-- Resonance -->
        <view class="glass-card section content-layer fade-in">
          <text class="section-title">🎯 性格共鸣</text>
          <text class="section-text">{{ character.personality?.resonance }}</text>
        </view>
        <!-- Shadow -->
        <view class="glass-card section content-layer fade-in">
          <text class="section-title">🌑 暗面</text>
          <text class="section-text">{{ character.personality?.shadow }}</text>
        </view>
        <!-- Advice -->
        <view class="glass-card section content-layer fade-in">
          <text class="section-title">✨ 给你的话</text>
          <text class="section-text">{{ character.personality?.advice }}</text>
        </view>
        <!-- Action -->
        <view class="action-row content-layer fade-in">
          <view class="btn btn-outline" @click="retry">再测一次</view>
          <view class="btn btn-accent" @click="share">📤 分享结果</view>
        </view>
      </template>
    </LoadingWrapper>
    <text class="disclaimer content-layer">仅供娱乐 · 不涉及迷信内容</text>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import ParticleEffect from '@/components/ParticleEffect.vue';
import LoadingWrapper from '@/components/LoadingWrapper.vue';
import CharacterPortrait from '@/components/CharacterPortrait.vue';
import { addHistory } from '@/utils/storage';

const character = ref(null);
const scores = ref(null);
const showParticles = ref(false);

onMounted(() => {
  const pages = getCurrentPages();
  const query = pages[pages.length - 1]?.options || {};

  if (query.data) {
    try {
      const data = JSON.parse(decodeURIComponent(query.data));
      character.value = data.character;
      scores.value = data.scores;
      addHistory({ type: 'character', name: data.character?.name });
      setTimeout(() => { showParticles.value = true; }, 500);
    } catch (e) {
      uni.showToast({ title: '数据解析失败', icon: 'none' });
    }
  }
});

const retry = () => {
  uni.switchTab({ url: '/pages/character/character' });
};

const share = () => {
  // WeChat share
  if (character.value) {
    uni.setClipboardData({
      data: `我匹配到了「${character.value.name}」${character.value.emoji}\n"${character.value.tagline}"\n来星语小馆测测你的角色吧～`,
      success: () => uni.showToast({ title: '结果已复制，去分享吧', icon: 'none' })
    });
  }
};
</script>

<style lang="scss" scoped>
.page-result {
  padding: 0 32rpx 120rpx;
}
.reveal { text-align: center; padding: 60rpx 0 40rpx; }
.portrait-wrap {
  display: flex; justify-content: center; margin-bottom: 24rpx;
  animation: floatY 4s ease-in-out infinite;
}
.reveal-name {
  font-size: 48rpx; font-weight: bold;
  background: linear-gradient(180deg, #F0C99A, #D4A574, #B8865A);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.reveal-tagline { display: block; font-size: 26rpx; color: #B0B0C8; margin-top: 16rpx; font-style: italic; }

.score-card { text-align: center; padding: 36rpx; margin-bottom: 24rpx; }
.score-number { font-size: 72rpx; font-weight: bold; color: #D4A574; }
.score-label { display: block; font-size: 24rpx; color: #999; margin-top: 4rpx; }
.score-details { display: flex; justify-content: center; gap: 48rpx; margin-top: 24rpx; }
.score-item { text-align: center; }
.si-label { font-size: 22rpx; color: #888; display: block; }
.si-val { font-size: 28rpx; color: #DDD; font-weight: bold; margin-top: 4rpx; }

.section { margin-bottom: 20rpx; padding: 28rpx; }
.section-title { font-size: 30rpx; color: #D4A574; font-weight: bold; display: block; margin-bottom: 12rpx; }
.section-text { font-size: 28rpx; color: #B0B0C8; line-height: 1.8; }

.action-row { display: flex; gap: 24rpx; padding: 32rpx 0; }
.action-row .btn { flex: 1; padding: 24rpx; font-size: 28rpx; border-radius: 24rpx; }
.disclaimer { display: block; text-align: center; font-size: 20rpx; color: #555; }

.fade-in { animation: fadeIn 0.6s ease-out both; }
.fade-in:nth-child(2) { animation-delay: 0.1s; }
.fade-in:nth-child(3) { animation-delay: 0.2s; }
.fade-in:nth-child(4) { animation-delay: 0.3s; }
.fade-in:nth-child(5) { animation-delay: 0.4s; }
.fade-in:nth-child(6) { animation-delay: 0.5s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(30rpx); } to { opacity: 1; transform: translateY(0); } }
@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}
</style>
