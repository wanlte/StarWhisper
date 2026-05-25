<template>
  <view class="page-mypage page-bg">
    <StarryBackground />
    <view class="hero content-layer">
      <text class="hero-title">👤 个人中心</text>
    </view>
    <!-- Birthday & Zodiac -->
    <view class="glass-card section content-layer">
      <text class="section-title">🎂 生日识星座</text>
      <view class="birthday-row">
        <picker mode="date" :value="birthday" @change="onBirthdayChange">
          <view class="picker-display">
            <text>{{ birthday || '选择你的生日' }}</text>
          </view>
        </picker>
        <view v-if="myZodiac" class="zodiac-badge">
          <text class="zb-emoji">{{ myZodiac.emoji }}</text>
          <text class="zb-name">{{ myZodiac.name }}</text>
        </view>
      </view>
    </view>
    <!-- History -->
    <view class="glass-card section content-layer">
      <text class="section-title">📋 最近浏览</text>
      <view v-if="history.length === 0" class="empty">
        <text class="empty-text">还没有浏览记录
去探索星座吧 ✨</text>
      </view>
      <view v-for="(item, idx) in history" :key="idx" class="history-item" @click="goHistory(item)">
        <text class="hi-icon">{{ item.type === 'zodiac' ? '♈' : item.type === 'match' ? '💑' : '🎭' }}</text>
        <view class="hi-info">
          <text class="hi-title">{{ item.name || (item.zodiac1 + ' × ' + item.zodiac2) }}</text>
          <text class="hi-type">{{ item.type === 'zodiac' ? '星座详情' : item.type === 'match' ? '星座配对' : '角色匹配' }}</text>
        </view>
        <text class="hi-arrow">›</text>
      </view>
    </view>
    <!-- Disclaimer -->
    <view class="glass-card section content-layer">
      <text class="section-title">📜 关于星语小馆</text>
      <text class="about-text">
        星语小馆是一款纯娱乐性质的星座趣味小程序。所有内容仅供参考娱乐，不构成任何形式的指导建议。

        我们严格遵守微信小程序运营规范，绝不涉及算命、吉凶、祸福、改运等违规内容。

        愿你在星语小馆找到一份温暖和乐趣 ✨
      </text>
    </view>
    <view class="btn btn-outline disclaimer-btn content-layer" @click="showDisclaimer = true">
      📜 查看免责声明
    </view>
    <DisclaimerModal :visible="showDisclaimer" @agree="showDisclaimer = false" @close="showDisclaimer = false" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import DisclaimerModal from '@/components/DisclaimerModal.vue';
import { getHistory, getBirthday as getStoredBirthday, setBirthday } from '@/utils/storage';
import { birthdayToZodiac, zodiacEmojis } from '@/utils/zodiac';
import { getZodiacList } from '@/api/zodiac';

const birthday = ref('');
const myZodiac = ref(null);
const history = ref([]);
const showDisclaimer = ref(false);
const zodiacList = ref([]);

onMounted(async () => {
  birthday.value = getStoredBirthday();
  history.value = getHistory();
  try {
    zodiacList.value = await getZodiacList();
  } catch (e) {}
  if (birthday.value) calcZodiac(birthday.value);
});

function onBirthdayChange(e) {
  const val = e.detail.value;
  birthday.value = val;
  setBirthday(val);
  calcZodiac(val);
}

function calcZodiac(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const name = birthdayToZodiac(m, d);
  const found = zodiacList.value.find(z => z.name === name);
  myZodiac.value = found || { name, emoji: zodiacEmojis[name] || '✨' };
}

function goHistory(item) {
  if (item.type === 'zodiac') {
    uni.navigateTo({ url: '/pages/detail/detail?name=' + encodeURIComponent(item.name) });
  } else if (item.type === 'match') {
    uni.navigateTo({ url: '/pages/match/match' });
  } else if (item.type === 'character') {
    uni.navigateTo({ url: '/pages/character/character' });
  }
}
</script>

<style lang="scss" scoped>
.page-mypage {
  padding: 0 32rpx 120rpx;
}
.hero { text-align: center; padding: 60rpx 0 40rpx; }
.hero-title { font-size: 40rpx; font-weight: bold; color: #D4A574; }
.section { margin-bottom: 24rpx; padding: 28rpx; }
.section-title { font-size: 30rpx; font-weight: bold; color: #D4A574; display: block; margin-bottom: 20rpx; }

.birthday-row { display: flex; align-items: center; gap: 24rpx; }
.picker-display { padding: 20rpx 28rpx; background: rgba(255,255,255,0.06); border-radius: 12rpx; font-size: 28rpx; color: #DDD; }
.zodiac-badge { display: flex; align-items: center; gap: 8rpx; padding: 16rpx 24rpx; background: rgba(212,165,116,0.1); border-radius: 12rpx; }
.zb-emoji { font-size: 36rpx; }
.zb-name { font-size: 26rpx; color: #D4A574; font-weight: bold; }

.empty { padding: 48rpx 0; text-align: center; }
.empty-text { font-size: 26rpx; color: #888; white-space: pre-wrap; line-height: 1.8; }

.history-item { display: flex; align-items: center; padding: 20rpx 16rpx; margin-bottom: 12rpx; background: rgba(255,255,255,0.04); border-radius: 12rpx; }
.hi-icon { font-size: 36rpx; margin-right: 20rpx; }
.hi-info { flex: 1; }
.hi-title { font-size: 28rpx; color: #DDD; display: block; }
.hi-type { font-size: 22rpx; color: #888; margin-top: 4rpx; }
.hi-arrow { font-size: 32rpx; color: #666; }

.about-text { font-size: 26rpx; color: #B0B0C0; line-height: 1.8; white-space: pre-wrap; }
.disclaimer-btn { width: 400rpx; margin: 16rpx auto; padding: 20rpx; font-size: 26rpx; border-radius: 24rpx; }
</style>
