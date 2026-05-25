<template>
  <view class="page-match page-bg">
    <StarryBackground />

    <view class="hero content-layer">
      <text class="hero-title">💑 星座配对</text>
      <text class="hero-sub">看看你们的星座有多合拍</text>
    </view>

    <!-- Selectors -->
    <view class="selectors content-layer">
      <view class="selector glass-card-interactive" @click="showPicker('a')">
        <text class="sel-emoji">{{ zodiacA.emoji || '❓' }}</text>
        <text class="sel-name">{{ zodiacA.name || '选择星座' }}</text>
        <text v-if="zodiacA.dateRange" class="sel-date">{{ zodiacA.dateRange }}</text>
      </view>

      <view class="vs-glow">
        <text class="vs-text">×</text>
      </view>

      <view class="selector glass-card-interactive" @click="showPicker('b')">
        <text class="sel-emoji">{{ zodiacB.emoji || '❓' }}</text>
        <text class="sel-name">{{ zodiacB.name || '选择星座' }}</text>
        <text v-if="zodiacB.dateRange" class="sel-date">{{ zodiacB.dateRange }}</text>
      </view>
    </view>

    <!-- Match Button -->
    <view class="content-layer match-btn-wrap">
      <view
        class="match-btn glass-card-interactive"
        :class="{ disabled: !canMatch }"
        @click="doMatch"
      >
        <text class="match-btn-text">🔮 开始配对</text>
      </view>
    </view>

    <!-- Result -->
    <view v-if="result" class="result-card glass-card-glow content-layer anim-scale-in">
      <view class="result-header">
        <text class="result-score">{{ result.score }}%</text>
        <view class="result-level-badge">
          <text class="result-level">{{ result.level }}</text>
        </view>
      </view>
      <text class="result-summary">{{ result.summary }}</text>
      <view class="result-grid">
        <view class="result-section">
          <text class="result-label">💕 爱情</text>
          <text class="result-text">{{ result.love }}</text>
        </view>
        <view class="result-section">
          <text class="result-label">🤝 友情</text>
          <text class="result-text">{{ result.friendship }}</text>
        </view>
      </view>
      <view class="result-section">
        <text class="result-label">💡 建议</text>
        <text class="result-text">{{ result.advice }}</text>
      </view>
    </view>

    <text class="disclaimer content-layer">仅供娱乐 · 不涉及迷信内容</text>

    <!-- Custom Picker Modal -->
    <view v-if="pickerVisible" class="picker-overlay" @click="closePicker">
      <view class="picker-panel" @click.stop>
        <view class="picker-handle" />
        <text class="picker-title">✨ 选择星座</text>
        <scroll-view class="picker-list" scroll-y>
          <view
            v-for="z in zodiacList"
            :key="z.id"
            class="picker-item"
            :class="{ 'picker-item--selected': isSelected(z) }"
            @click="selectZodiac(z)"
          >
            <text class="picker-emoji">{{ z.emoji }}</text>
            <view class="picker-info">
              <text class="picker-name">{{ z.name }}</text>
              <text class="picker-date">{{ z.dateRange }}</text>
            </view>
            <text v-if="isSelected(z)" class="picker-check">✓</text>
          </view>
        </scroll-view>
        <view class="picker-cancel glass-card-interactive" @click="closePicker">
          <text>取消</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import { getZodiacList, getZodiacMatch } from '@/api/zodiac';
import { addHistory } from '@/utils/storage';

const zodiacA = ref({});
const zodiacB = ref({});
const result = ref(null);
const zodiacList = ref([]);
const pickTarget = ref(null);
const pickerVisible = ref(false);

const canMatch = computed(() => zodiacA.value.name && zodiacB.value.name);

// Pre-fill from URL params (from homepage dual-select)
const pages = getCurrentPages();
const query = pages[pages.length - 1]?.options || {};

async function initZodiacs() {
  try {
    zodiacList.value = await getZodiacList();
    // Pre-fill from URL params
    if (query.zodiac1) {
      const m1 = zodiacList.value.find(z => z.name === decodeURIComponent(query.zodiac1));
      if (m1) zodiacA.value = { name: m1.name, emoji: m1.emoji, dateRange: m1.dateRange };
    }
    if (query.zodiac2) {
      const m2 = zodiacList.value.find(z => z.name === decodeURIComponent(query.zodiac2));
      if (m2) zodiacB.value = { name: m2.name, emoji: m2.emoji, dateRange: m2.dateRange };
    }
    // Auto-match if both pre-filled
    if (zodiacA.value.name && zodiacB.value.name) {
      doMatch();
    }
  } catch (e) { /* silent */ }
}

initZodiacs();

async function showPicker(target) {
  pickTarget.value = target;
  if (!zodiacList.value.length) {
    uni.showLoading({ title: '加载中...' });
    try { zodiacList.value = await getZodiacList(); } catch (e) {
      uni.showToast({ title: '加载星座列表失败', icon: 'none' });
      return;
    } finally {
      uni.hideLoading();
    }
  }
  pickerVisible.value = true;
}

function isSelected(z) {
  if (pickTarget.value === 'a') return zodiacA.value.name === z.name;
  if (pickTarget.value === 'b') return zodiacB.value.name === z.name;
  return false;
}

function selectZodiac(z) {
  const item = { name: z.name, emoji: z.emoji, dateRange: z.dateRange };
  if (pickTarget.value === 'a') zodiacA.value = item;
  else zodiacB.value = item;
  pickerVisible.value = false;
}

function closePicker() {
  pickerVisible.value = false;
}

async function doMatch() {
  if (!canMatch.value) return;
  try {
    uni.showLoading({ title: '星辰解读中...' });
    result.value = await getZodiacMatch(zodiacA.value.name, zodiacB.value.name);
    addHistory({ type: 'match', zodiac1: zodiacA.value.name, zodiac2: zodiacB.value.name });
  } catch (e) { /* silent */ } finally {
    uni.hideLoading();
  }
}
</script>

<style lang="scss" scoped>
.page-match {
  padding: 0 32rpx 120rpx;
}

.hero { text-align: center; padding: 40rpx 0 32rpx; }
.hero-title {
  font-size: 44rpx; font-weight: bold;
  background: linear-gradient(180deg, #F0C99A, #D4A574);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-sub { font-size: 24rpx; color: #8888AA; display: block; margin-top: 6rpx; }

.selectors { display: flex; align-items: center; justify-content: center; gap: 24rpx; padding: 20rpx 0 32rpx; }
.selector {
  display: flex; flex-direction: column; align-items: center;
  padding: 32rpx 28rpx; min-width: 200rpx;
}
.sel-emoji { font-size: 64rpx; margin-bottom: 8rpx; }
.sel-name { font-size: 26rpx; color: #DDD; font-weight: bold; }
.sel-date { font-size: 18rpx; color: #888; margin-top: 4rpx; }

.vs-glow {
  width: 64rpx; height: 64rpx;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(circle, rgba(212,165,116,0.2) 0%, transparent 70%);
  border-radius: 50%;
}
.vs-text { font-size: 32rpx; color: #D4A574; }

.match-btn-wrap { display: flex; justify-content: center; padding-bottom: 32rpx; }
.match-btn {
  padding: 20rpx 56rpx; border-radius: 40rpx;
}
.match-btn.disabled { opacity: 0.35; pointer-events: none; }
.match-btn-text { font-size: 30rpx; color: #F0E6FF; }

.result-card {
  padding: 36rpx; margin-bottom: 32rpx;
}
.result-header { display: flex; align-items: center; gap: 16rpx; margin-bottom: 16rpx; }
.result-score {
  font-size: 64rpx; font-weight: bold;
  background: linear-gradient(180deg, #F0C99A, #D4A574);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.result-level-badge {
  background: rgba(212,165,116,0.15);
  border: 1rpx solid rgba(212,165,116,0.3);
  border-radius: 20rpx;
  padding: 6rpx 20rpx;
}
.result-level { font-size: 24rpx; color: #F0C99A; }
.result-summary { font-size: 26rpx; color: #DDD; line-height: 1.7; display: block; margin-bottom: 20rpx; }
.result-grid { display: flex; gap: 20rpx; margin-bottom: 12rpx; }
.result-grid .result-section { flex: 1; }
.result-section { margin-bottom: 14rpx; }
.result-label { font-size: 24rpx; color: #D4A574; display: block; margin-bottom: 4rpx; }
.result-text { font-size: 24rpx; color: #B0B0C8; line-height: 1.6; }

.disclaimer { display: block; text-align: center; font-size: 20rpx; color: #555; }

/* Picker Modal */
.picker-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(0,0,0,0.65);
  display: flex; align-items: flex-end; justify-content: center;
}
.picker-panel {
  width: 100%; max-height: 68vh;
  background: linear-gradient(180deg, #1a1a3e 0%, #0f0f2e 100%);
  border-radius: 32rpx 32rpx 0 0;
  padding: 0 0 env(safe-area-inset-bottom);
}
.picker-handle {
  width: 60rpx; height: 6rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 3rpx;
  margin: 16rpx auto 20rpx;
}
.picker-title {
  font-size: 30rpx; color: #D4A574; text-align: center; display: block; margin-bottom: 20rpx;
}
.picker-list { max-height: 45vh; padding: 0 32rpx; }
.picker-item {
  display: flex; align-items: center; gap: 20rpx; padding: 22rpx 16rpx;
  border-bottom: 1rpx solid rgba(255,255,255,0.05);
  cursor: pointer;
  transition: background 0.2s;
}
.picker-item:active { background: rgba(212,165,116,0.06); }
.picker-item--selected { background: rgba(212,165,116,0.08); }
.picker-emoji { font-size: 40rpx; }
.picker-info { flex: 1; display: flex; flex-direction: column; }
.picker-name { font-size: 28rpx; color: #CCC; }
.picker-date { font-size: 20rpx; color: #777; }
.picker-check { font-size: 28rpx; color: #D4A574; font-weight: bold; }
.picker-cancel {
  text-align: center; padding: 26rpx; margin: 16rpx 32rpx 20rpx;
  border-radius: 20rpx; font-size: 26rpx; color: #999; cursor: pointer;
}
</style>
