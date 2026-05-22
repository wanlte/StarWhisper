<template>
  <view class="page-detail">
    <StarryBackground />
    <LoadingWrapper :loading="loading" text="星辰正在连通...">
      <template v-if="zodiac">
        <!-- Hero -->
        <view class="hero">
          <text class="hero-emoji">{{ zodiac.emoji }}</text>
          <text class="hero-name">{{ zodiac.name }}</text>
          <text class="hero-en">{{ zodiac.nameEn }}</text>
          <view class="hero-tags">
            <text class="tag">{{ zodiac.element }}</text>
            <text class="tag">{{ zodiac.rulingPlanet }}</text>
            <text class="tag">{{ zodiac.dateRange }}</text>
          </view>
        </view>
        <!-- Strengths & Weaknesses -->
        <view class="card section">
          <text class="section-title">✨ 性格特征</text>
          <view class="trait-list">
            <view v-for="t in zodiac.personality.traits" :key="t.title" class="trait-item">
              <text class="trait-title">{{ t.title }}</text>
              <text class="trait-desc">{{ t.desc }}</text>
            </view>
          </view>
        </view>
        <view class="card section">
          <text class="section-title">💪 优势</text>
          <view class="chip-wrap">
            <text v-for="s in zodiac.personality.strengths" :key="s" class="chip chip-green">{{ s }}</text>
          </view>
        </view>
        <view class="card section">
          <text class="section-title">🔍 小缺点</text>
          <view class="chip-wrap">
            <text v-for="w in zodiac.personality.weaknesses" :key="w" class="chip chip-pink">{{ w }}</text>
          </view>
        </view>
        <!-- Daily Advice -->
        <view class="card section">
          <text class="section-title">🌟 今日提示</text>
          <view class="advice-grid">
            <view class="advice-item"><text class="advice-label">心情</text><text class="advice-val">{{ zodiac.dailyAdvice.mood }}</text></view>
            <view class="advice-item"><text class="advice-label">爱情</text><text class="advice-val">{{ zodiac.dailyAdvice.love }}</text></view>
            <view class="advice-item"><text class="advice-label">工作</text><text class="advice-val">{{ zodiac.dailyAdvice.work }}</text></view>
            <view class="advice-item"><text class="advice-label">幸运色</text><text class="advice-val">{{ zodiac.dailyAdvice.luckyColor }}</text></view>
            <view class="advice-item"><text class="advice-label">幸运数</text><text class="advice-val">{{ zodiac.dailyAdvice.luckyNumber }}</text></view>
            <view class="advice-item"><text class="advice-label">小仪式</text><text class="advice-val">{{ zodiac.dailyAdvice.ritual }}</text></view>
          </view>
        </view>
        <!-- Fun Fact -->
        <view class="card section">
          <text class="section-title">🎲 冷知识</text>
          <text class="fun-fact">{{ zodiac.funFact }}</text>
        </view>
        <!-- Actions -->
        <view class="action-row">
          <view class="btn btn-accent" @click="goMatch">💑 配对看看</view>
          <view class="btn btn-primary" @click="goCharacter">🎭 匹配角色</view>
        </view>
        <text class="disclaimer">仅供娱乐 · 不涉及迷信内容</text>
      </template>
    </LoadingWrapper>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import LoadingWrapper from '@/components/LoadingWrapper.vue';
import { getZodiacDetail } from '@/api/zodiac';
import { addHistory } from '@/utils/storage';

const zodiac = ref(null);
const loading = ref(true);

onMounted(async () => {
  const query = getCurrentPages().pop()?.options || {};
  const name = query.name;
  if (name) {
    try {
      zodiac.value = await getZodiacDetail(name);
      addHistory({ type: 'zodiac', name });
    } catch (e) {
      uni.showToast({ title: '加载失败', icon: 'none' });
    }
  }
  loading.value = false;
});

const goMatch = () => {
  uni.navigateTo({ url: '/pages/match/match' });
};

const goCharacter = () => {
  uni.navigateTo({ url: '/pages/character/character' });
};
</script>

<style lang="scss" scoped>
.page-detail {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 0 32rpx 120rpx;
}
.hero {
  position: relative; z-index: 2;
  text-align: center; padding: 80rpx 0 48rpx;
}
.hero-emoji { font-size: 100rpx; display: block; margin-bottom: 16rpx; }
.hero-name {
  font-size: 48rpx; font-weight: bold;
  background: linear-gradient(180deg, #D4A574, #F0C99A);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-en { font-size: 26rpx; color: #777; display: block; margin-top: 8rpx; }
.hero-tags { display: flex; justify-content: center; gap: 16rpx; margin-top: 20rpx; }
.tag {
  padding: 8rpx 20rpx; font-size: 22rpx; color: #D4A574;
  background: rgba(212, 165, 116, 0.1); border-radius: 20rpx;
}

.section { position: relative; z-index: 2; margin-bottom: 24rpx; }
.section-title { font-size: 30rpx; font-weight: bold; color: #D4A574; display: block; margin-bottom: 20rpx; }

.trait-item { margin-bottom: 20rpx; }
.trait-title { font-size: 28rpx; color: #DDD; font-weight: bold; display: block; margin-bottom: 6rpx; }
.trait-desc { font-size: 26rpx; color: #B0B0C0; line-height: 1.7; }

.chip-wrap { display: flex; flex-wrap: wrap; gap: 12rpx; }
.chip { padding: 8rpx 24rpx; font-size: 24rpx; border-radius: 20rpx; }
.chip-green { background: rgba(76, 175, 80, 0.15); color: #81C784; }
.chip-pink { background: rgba(239, 83, 80, 0.12); color: #EF9A9A; }

.advice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; }
.advice-item { padding: 16rpx; background: rgba(255,255,255,0.04); border-radius: 12rpx; }
.advice-label { font-size: 22rpx; color: #888; display: block; margin-bottom: 6rpx; }
.advice-val { font-size: 26rpx; color: #DDD; }

.fun-fact { font-size: 26rpx; color: #B0B0C0; line-height: 1.7; }

.action-row {
  position: relative; z-index: 2;
  display: flex; gap: 24rpx; padding: 24rpx 0;
}
.action-row .btn { flex: 1; padding: 24rpx; font-size: 28rpx; }
.disclaimer { display: block; text-align: center; font-size: 22rpx; color: #666; position: relative; z-index: 2; padding: 16rpx 0; }
</style>
