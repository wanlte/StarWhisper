<template>
  <view class="page-index page-bg">
    <StarryBackground />

    <!-- Header -->
    <view class="header content-layer">
      <view class="header-star header-star--top">
        <view class="hs-h" />
        <view class="hs-v" />
      </view>
      <text class="header-title">星座匹配·塔罗占卜</text>
      <view class="header-star header-star--bottom">
        <view class="hs-h" />
        <view class="hs-v" />
      </view>
    </view>

    <!-- Constellation carousel — main centerpiece -->
    <view class="carousel-section content-layer">
      <LoadingWrapper :loading="loading" text="星辰正在排列...">
        <ConstellationCarousel
          :zodiacs="zodiacList"
          :selectMode="selectMode"
          @select="goDetail"
          @select-first="onSelectFirst"
          @select-second="onSelectSecond"
        />
      </LoadingWrapper>
    </view>

    <!-- Pairing button — below carousel -->
    <view class="pairing-row content-layer">
      <view
        class="pairing-tag"
        :class="{ 'pairing-tag--active': selectMode }"
        @click="toggleSelectMode"
      >
        <text class="pairing-tag-text">{{ selectMode ? '取消配对' : '双生配对' }}</text>
      </view>
    </view>

    <!-- Tarot panel — compact, above action strip -->
    <view class="tarot-row content-layer">
      <TarotEntry @draw="onTarotDraw" />
    </view>

    <!-- Action strip -->
    <view class="action-strip content-layer">
      <view class="action-item" @click="goMatch">
        <text class="action-icon">💑</text>
        <text class="action-label">星座配对</text>
      </view>
      <view class="action-item" @click="goCharacter">
        <text class="action-icon">🎭</text>
        <text class="action-label">角色匹配</text>
      </view>
      <view class="action-item" @click="goMypage">
        <text class="action-icon">👤</text>
        <text class="action-label">个人中心</text>
      </view>
    </view>
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

const onTarotDraw = (type) => {
  uni.navigateTo({ url: '/pages/tarot/tarot?type=' + type });
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Header ── */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 60rpx 32rpx 10rpx;
  flex-shrink: 0;
}
.header-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #FFFFFF;
  text-shadow:
    0 0 14rpx rgba(255, 255, 255, 0.35),
    0 0 30rpx rgba(220, 200, 255, 0.2),
    0 0 55rpx rgba(180, 160, 230, 0.1);
  letter-spacing: 3rpx;
}
.header-star {
  position: relative;
  width: 16rpx; height: 16rpx;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.hs-h, .hs-v {
  position: absolute;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.7) 30%,
    rgba(255, 255, 255, 0.95) 50%,
    rgba(255, 255, 255, 0.7) 70%,
    transparent 100%
  );
  box-shadow:
    0 0 3rpx rgba(255, 255, 255, 0.6),
    0 0 7rpx rgba(220, 200, 255, 0.3);
  border-radius: 1rpx;
}
.hs-h { width: 20rpx; height: 1.5rpx; }
.hs-v { width: 1.5rpx; height: 20rpx; }

/* ── Carousel section — main visual centerpiece ── */
.carousel-section {
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ── Pairing button ── */
.pairing-row {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 4rpx 32rpx 6rpx;
  flex-shrink: 0;
}
.pairing-tag {
  display: flex;
  align-items: center;
  padding: 10rpx 32rpx;
  border-radius: 28rpx;
  background: rgba(120, 70, 160, 0.25);
  border: 1rpx solid rgba(170, 130, 210, 0.25);
  transition: all 0.2s;
  cursor: pointer;
}
.pairing-tag:active {
  background: rgba(160, 110, 210, 0.3);
  border-color: rgba(190, 150, 225, 0.4);
}
.pairing-tag--active {
  background: rgba(200, 140, 180, 0.25);
  border-color: rgba(210, 150, 190, 0.4);
}
.pairing-tag-text {
  font-size: 22rpx;
  color: #D0C0E8;
  letter-spacing: 1rpx;
}

/* ── Tarot row — compact, near bottom ── */
.tarot-row {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 6rpx 32rpx 8rpx;
  flex-shrink: 0;
}

/* ── Action strip ── */
.action-strip {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  padding: 6rpx 32rpx 14rpx;
  flex-shrink: 0;
}
.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
  padding: 10rpx 16rpx;
  min-width: 110rpx;
  border-radius: 16rpx;
  background: rgba(40, 20, 70, 0.45);
  border: 1rpx solid rgba(180, 160, 220, 0.15);
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.04),
    0 2rpx 12rpx rgba(0, 0, 0, 0.2);
}
.action-item:active {
  background: rgba(100, 60, 150, 0.45);
  border-color: rgba(200, 170, 230, 0.3);
  transform: scale(0.96);
}
.action-icon { font-size: 28rpx; }
.action-label {
  font-size: 18rpx;
  color: #C0B0D8;
}
</style>
