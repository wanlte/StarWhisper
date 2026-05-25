<template>
  <view class="page-index page-bg">
    <StarryBackground />

    <!-- Header -->
    <view class="header content-layer">
      <text class="header-icon">🔮</text>
      <text class="header-title glow-text">星语小馆</text>
      <text class="header-sub">探索你的星座故事</text>
    </view>

    <!-- Constellation Carousel -->
    <LoadingWrapper :loading="loading" text="星辰正在排列...">
      <view class="hero-section content-layer">
        <text class="section-hint">点击中央卡片查看详情</text>
        <ConstellationCarousel
          :zodiacs="zodiacList"
          :selectMode="selectMode"
          @select="goDetail"
          @select-first="onSelectFirst"
          @select-second="onSelectSecond"
          @toggle-select-mode="toggleSelectMode"
        />
      </view>
    </LoadingWrapper>

    <!-- Tarot Entry Module -->
    <view class="secondary-section content-layer">
      <TarotEntry @click="goTarot" />
    </view>

    <!-- Action Strip -->
    <view class="action-strip content-layer">
      <view class="action-item glass-card-interactive" @click="goMatch">
        <text class="action-emoji">💑</text>
        <text class="action-label">星座配对</text>
      </view>
      <view class="action-item glass-card-interactive" @click="goCharacter">
        <text class="action-emoji">🎭</text>
        <text class="action-label">角色匹配</text>
      </view>
      <view class="action-item glass-card-interactive" @click="goMypage">
        <text class="action-emoji">👤</text>
        <text class="action-label">个人中心</text>
      </view>
    </view>

    <!-- Disclaimer -->
    <text class="disclaimer content-layer">仅供娱乐 · 不涉及迷信内容</text>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import LoadingWrapper from '@/components/LoadingWrapper.vue';
import ConstellationCarousel from '@/components/ConstellationCarousel.vue';
import TarotEntry from '@/components/TarotEntry.vue';
import { getZodiacList } from '@/api/zodiac';
import { addHistory } from '@/utils/storage';

const zodiacList = ref([]);
const loading = ref(true);
const selectMode = ref(false);
const selectedFirst = ref(null);

onMounted(async () => {
  try {
    zodiacList.value = await getZodiacList();
  } catch (e) {
    // Fallback to empty, component handles gracefully
  } finally {
    loading.value = false;
  }
});

function toggleSelectMode() {
  selectMode.value = !selectMode.value;
  selectedFirst.value = null;
}

function onSelectFirst(z) {
  selectedFirst.value = z;
}

function onSelectSecond(z) {
  selectMode.value = false;
  uni.navigateTo({
    url: `/pages/match/match?zodiac1=${encodeURIComponent(selectedFirst.value.name)}&zodiac2=${encodeURIComponent(z.name)}`
  });
  selectedFirst.value = null;
}

const goDetail = (z) => {
  addHistory({ type: 'zodiac', name: z.name });
  uni.navigateTo({ url: '/pages/detail/detail?name=' + encodeURIComponent(z.name) });
};

const goMatch = () => {
  uni.navigateTo({ url: '/pages/match/match' });
};

const goTarot = () => {
  uni.navigateTo({ url: '/pages/tarot/tarot' });
};

const goCharacter = () => {
  uni.switchTab({ url: '/pages/character/character' });
};

const goMypage = () => {
  uni.switchTab({ url: '/pages/mypage/mypage' });
};
</script>

<style lang="scss" scoped>
.page-index {
  padding-bottom: 120rpx + env(safe-area-inset-bottom);
}

/* Header */
.header {
  padding: 100rpx 40rpx 32rpx;
  text-align: center;
}
.header-icon {
  font-size: 48rpx;
  display: block;
  margin-bottom: 8rpx;
  animation: floatY 4s ease-in-out infinite;
}
.header-title {
  display: block;
  font-size: 56rpx;
  font-weight: bold;
  background: linear-gradient(180deg, #F0C99A 0%, #D4A574 40%, #B8865A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8rpx;
}
.header-sub {
  display: block;
  font-size: 26rpx;
  color: #8888AA;
}

/* Hero */
.hero-section {
  padding: 0 0 16rpx;
}
.section-hint {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #666688;
  margin-bottom: 8rpx;
}

/* Action Strip */
.action-strip {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  padding: 24rpx 32rpx;
}
.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 22rpx 32rpx;
  min-width: 160rpx;
  border-radius: 20rpx;
  cursor: pointer;
}
.action-emoji {
  font-size: 40rpx;
}
.action-label {
  font-size: 22rpx;
  color: #BBB;
}

/* Disclaimer */
.disclaimer {
  display: block;
  text-align: center;
  font-size: 20rpx;
  color: #555;
  padding: 24rpx 0 32rpx;
}

@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}
</style>
