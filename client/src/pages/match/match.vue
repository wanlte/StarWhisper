<template>
  <view class="page-match">
    <StarryBackground />
    <view class="hero">
      <text class="hero-title">💑 星座配对</text>
      <text class="hero-sub">看看你们的星座有多合拍</text>
    </view>
    <!-- Zodiac Selectors -->
    <view class="selectors">
      <view class="selector" @click="showPicker('a')">
        <text class="sel-emoji">{{ zodiacA.emoji || '❓' }}</text>
        <text class="sel-name">{{ zodiacA.name || '选择星座' }}</text>
      </view>
      <text class="vs">×</text>
      <view class="selector" @click="showPicker('b')">
        <text class="sel-emoji">{{ zodiacB.emoji || '❓' }}</text>
        <text class="sel-name">{{ zodiacB.name || '选择星座' }}</text>
      </view>
    </view>
    <!-- Match Button -->
    <view class="btn btn-accent match-btn" @click="doMatch" :class="{ disabled: !canMatch }">
      🔮 开始配对
    </view>
    <!-- Result -->
    <view v-if="result" class="result-card card fade-in">
      <view class="result-header">
        <text class="result-score">{{ result.score }}%</text>
        <text class="result-level">{{ result.level }}</text>
      </view>
      <text class="result-summary">{{ result.summary }}</text>
      <view class="result-section">
        <text class="result-label">💕 爱情</text>
        <text class="result-text">{{ result.love }}</text>
      </view>
      <view class="result-section">
        <text class="result-label">🤝 友情</text>
        <text class="result-text">{{ result.friendship }}</text>
      </view>
      <view class="result-section">
        <text class="result-label">💡 建议</text>
        <text class="result-text">{{ result.advice }}</text>
      </view>
    </view>
    <text class="disclaimer">仅供娱乐 · 不涉及迷信内容</text>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import { getZodiacList, getZodiacMatch } from '@/api/zodiac';
import { zodiacEmojis } from '@/utils/zodiac';
import { addHistory } from '@/utils/storage';

const zodiacA = ref({});
const zodiacB = ref({});
const result = ref(null);
const zodiacList = ref([]);

const pickTarget = ref(null);

const canMatch = computed(() => zodiacA.value.name && zodiacB.value.name);

async function showPicker(target) {
  pickTarget.value = target;
  if (!zodiacList.value.length) {
    try { zodiacList.value = await getZodiacList(); } catch (e) {
      uni.showToast({ title: '加载星座列表失败，请检查云函数是否已部署', icon: 'none' });
      return;
    }
  }
  const names = zodiacList.value.map(z => z.name);
  uni.showActionSheet({
    itemList: names,
    success: (res) => {
      const z = zodiacList.value[res.tapIndex];
      const item = { name: z.name, emoji: z.emoji };
      if (pickTarget.value === 'a') zodiacA.value = item;
      else zodiacB.value = item;
    }
  });
}

async function doMatch() {
  if (!canMatch.value) return;
  try {
    result.value = await getZodiacMatch(zodiacA.value.name, zodiacB.value.name);
    addHistory({ type: 'match', zodiac1: zodiacA.value.name, zodiac2: zodiacB.value.name });
  } catch (e) {}
}
</script>

<style lang="scss" scoped>
.page-match {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 0 32rpx 120rpx;
}
.hero { position: relative; z-index: 2; text-align: center; padding: 60rpx 0 40rpx; }
.hero-title { font-size: 44rpx; font-weight: bold; color: #D4A574; }
.hero-sub { font-size: 26rpx; color: #999; display: block; margin-top: 8rpx; }

.selectors { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 32rpx; padding: 32rpx 0; }
.selector {
  display: flex; flex-direction: column; align-items: center; padding: 36rpx 48rpx;
  background: rgba(255,255,255,0.06); border-radius: 20rpx;
  border: 2rpx solid rgba(255,255,255,0.1); transition: all 0.2s;
}
.selector:active { background: rgba(212,165,116,0.12); border-color: rgba(212,165,116,0.3); }
.sel-emoji { font-size: 60rpx; margin-bottom: 8rpx; }
.sel-name { font-size: 26rpx; color: #CCC; }
.vs { font-size: 36rpx; color: #666; }

.match-btn { position: relative; z-index: 2; width: 400rpx; margin: 16rpx auto 40rpx; padding: 24rpx; font-size: 30rpx; }
.match-btn.disabled { opacity: 0.4; }

.result-card { position: relative; z-index: 2; padding: 36rpx; margin-bottom: 32rpx; }
.result-header { display: flex; align-items: baseline; gap: 16rpx; margin-bottom: 20rpx; }
.result-score { font-size: 56rpx; font-weight: bold; color: #D4A574; }
.result-level { font-size: 28rpx; color: #F0C99A; }
.result-summary { font-size: 28rpx; color: #DDD; line-height: 1.7; display: block; margin-bottom: 24rpx; }
.result-section { margin-bottom: 16rpx; }
.result-label { font-size: 26rpx; color: #D4A574; display: block; margin-bottom: 6rpx; }
.result-text { font-size: 26rpx; color: #B0B0C0; line-height: 1.7; }

.disclaimer { display: block; text-align: center; font-size: 22rpx; color: #666; position: relative; z-index: 2; }

.fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20rpx); } to { opacity: 1; transform: translateY(0); } }
</style>
