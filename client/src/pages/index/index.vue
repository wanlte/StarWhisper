<template>
  <view class="page-index">
    <StarryBackground />
    <!-- Header -->
    <view class="header">
      <text class="header-title">星语小馆</text>
      <text class="header-sub">探索你的星座故事</text>
    </view>
    <!-- Zodiac Grid -->
    <LoadingWrapper :loading="loading" text="星辰正在排列...">
      <view class="zodiac-grid">
        <view
          v-for="item in zodiacList"
          :key="item.id"
          class="zodiac-item"
          :style="{ animationDelay: (item.id * 0.05) + 's' }"
          @click="goDetail(item.name)"
        >
          <text class="zodiac-emoji">{{ item.emoji }}</text>
          <text class="zodiac-name">{{ item.name }}</text>
          <text class="zodiac-en">{{ item.nameEn }}</text>
        </view>
      </view>
    </LoadingWrapper>
    <!-- Action Bar -->
    <view class="action-bar">
      <view class="action-btn" @click="goMatch">
        <text class="action-icon">💑</text>
        <text class="action-text">星座配对</text>
      </view>
      <view class="action-btn primary" @click="goCharacter">
        <text class="action-icon">🎭</text>
        <text class="action-text">角色匹配</text>
      </view>
      <view class="action-btn" @click="goMypage">
        <text class="action-icon">👤</text>
        <text class="action-text">个人中心</text>
      </view>
    </view>
    <!-- Disclaimer footer -->
    <text class="disclaimer">仅供娱乐 · 不涉及迷信内容</text>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import LoadingWrapper from '@/components/LoadingWrapper.vue';
import { getZodiacList } from '@/api/zodiac';
import { addHistory } from '@/utils/storage';

const zodiacList = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    zodiacList.value = await getZodiacList();
  } catch (e) {
    // Fallback to local emoji list
  } finally {
    loading.value = false;
  }
});

const goDetail = (name) => {
  addHistory({ type: 'zodiac', name });
  uni.navigateTo({ url: '/pages/detail/detail?name=' + encodeURIComponent(name) });
};

const goMatch = () => {
  uni.navigateTo({ url: '/pages/match/match' });
};

const goCharacter = () => {
  uni.navigateTo({ url: '/pages/character/character' });
};

const goMypage = () => {
  uni.switchTab({ url: '/pages/mypage/mypage' });
};
</script>

<style lang="scss" scoped>
.page-index {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding-bottom: 120rpx + env(safe-area-inset-bottom);
}
.header {
  padding: 120rpx 40rpx 48rpx;
  text-align: center;
  position: relative; z-index: 2;
}
.header-title {
  display: block;
  font-size: 52rpx; font-weight: bold;
  background: linear-gradient(180deg, #D4A574, #F0C99A);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 12rpx;
}
.header-sub {
  font-size: 28rpx; color: #999;
}
.zodiac-grid {
  position: relative; z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding: 0 32rpx;
}
.zodiac-item {
  display: flex; flex-direction: column; align-items: center;
  padding: 28rpx 12rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.06);
  transition: all 0.2s;
  animation: fadeInUp 0.4s ease-out both;
}
.zodiac-item:active {
  background: rgba(212, 165, 116, 0.12);
  border-color: rgba(212, 165, 116, 0.3);
}
.zodiac-emoji { font-size: 48rpx; margin-bottom: 8rpx; }
.zodiac-name { font-size: 24rpx; color: #DDD; font-weight: bold; }
.zodiac-en { font-size: 18rpx; color: #888; margin-top: 4rpx; }

.action-bar {
  position: relative; z-index: 2;
  display: flex; justify-content: center; gap: 24rpx;
  padding: 48rpx 32rpx 24rpx;
}
.action-btn {
  display: flex; flex-direction: column; align-items: center;
  padding: 28rpx 36rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s;
}
.action-btn.primary {
  background: rgba(212, 165, 116, 0.12);
  border-color: rgba(212, 165, 116, 0.3);
}
.action-btn:active {
  transform: scale(0.95);
  background: rgba(212, 165, 116, 0.15);
}
.action-icon { font-size: 44rpx; margin-bottom: 8rpx; }
.action-text { font-size: 24rpx; color: #CCC; }

.disclaimer {
  display: block; text-align: center;
  font-size: 22rpx; color: #666;
  padding: 24rpx 0;
  position: relative; z-index: 2;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
