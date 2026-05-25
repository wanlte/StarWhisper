<template>
  <view class="page-tarot page-bg">
    <StarryBackground />

    <!-- Stage 1: Intro -->
    <view v-if="stage === 'intro'" class="tarot-intro content-layer">
      <view class="intro-icon anim-float">🌙</view>
      <text class="intro-title glow-text">塔罗占卜</text>
      <text class="intro-desc">
        静心凝神，将你的问题默念于心{'\n'}
        然后从六张牌中，选择三张感应最强的牌
      </text>
      <view class="intro-btn glass-card-interactive" @click="startDraw">
        <text>✨ 开始抽牌</text>
      </view>
    </view>

    <!-- Stage 2: Draw -->
    <view v-if="stage === 'draw'" class="tarot-draw content-layer">
      <text class="draw-title">选择三张与你感应的牌</text>
      <text class="draw-sub">已选 {{ selectedCards.length }} / 3</text>

      <view class="draw-grid">
        <TarotCard
          v-for="(card, i) in drawCards"
          :key="i"
          :card="card"
          :flipped="card.revealed"
          :class="{ 'is-picked': selectedCards.includes(i) }"
          class="draw-card-item"
          @tap="pickCard(card, i)"
        />
      </view>

      <view
        v-if="selectedCards.length === 3"
        class="reveal-btn glass-card-interactive"
        @click="revealAll"
      >
        <text>🔮 揭晓答案</text>
      </view>
    </view>

    <!-- Stage 3: Reading -->
    <view v-if="stage === 'reading'" class="tarot-reading content-layer">
      <text class="reading-title">✨ 你的塔罗解读</text>

      <view class="reading-cards">
        <view
          v-for="(card, i) in revealedCards"
          :key="i"
          class="reading-card-item glass-card"
        >
          <view class="reading-card-header">
            <text class="reading-position">{{ positions[i] }}</text>
          </view>
          <text class="reading-symbol">{{ card.symbol }}</text>
          <text class="reading-name">{{ card.name }}</text>
          <view class="reading-divider" />
          <text class="reading-meaning">{{ card.meaning }}</text>
        </view>
      </view>

      <text class="reading-summary">
        三张牌的组合揭示了你的问题。过去影响现在，现在塑造未来。{'\n'}
        记住，塔罗是自我探索的工具，最终的抉择永远在你手中。
      </text>

      <view class="reading-actions">
        <view class="action-btn glass-card-interactive" @click="resetDraw">
          <text>🔄 重新占卜</text>
        </view>
        <view class="action-btn glass-card-interactive" @click="goHome">
          <text>🏠 返回首页</text>
        </view>
      </view>
    </view>

    <text class="disclaimer content-layer">仅供娱乐 · 不涉及迷信内容</text>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import TarotCard from '@/components/TarotCard.vue';

const stage = ref('intro');
const drawCards = ref([]);
const selectedCards = ref([]);
const revealedCards = ref([]);
const positions = ['过去', '现在', '未来'];

const majorArcana = [
  { name: '愚者', symbol: '🧭', meaning: '新的开始，冒险与无限可能', number: '0' },
  { name: '魔术师', symbol: '🪄', meaning: '创造力，技能，掌控局面', number: 'I' },
  { name: '女祭司', symbol: '🌙', meaning: '直觉，潜意识，内在智慧', number: 'II' },
  { name: '女皇', symbol: '👑', meaning: '丰饶，滋养，感官之美', number: 'III' },
  { name: '皇帝', symbol: '🏛', meaning: '权威，秩序，稳定结构', number: 'IV' },
  { name: '教皇', symbol: '📜', meaning: '传统，信仰，精神指引', number: 'V' },
  { name: '恋人', symbol: '💞', meaning: '选择，和谐，亲密关系', number: 'VI' },
  { name: '战车', symbol: '⚔', meaning: '意志力，胜利，克服困难', number: 'VII' },
  { name: '力量', symbol: '🦁', meaning: '勇气，耐心，内在力量', number: 'VIII' },
  { name: '隐者', symbol: '🏮', meaning: '内省，孤独，寻求真理', number: 'IX' },
  { name: '命运之轮', symbol: '🎡', meaning: '转变，周期，命运转折', number: 'X' },
  { name: '正义', symbol: '⚖', meaning: '公平，真相，因果关系', number: 'XI' },
  { name: '倒吊人', symbol: '🙃', meaning: '牺牲，换个角度看问题', number: 'XII' },
  { name: '死神', symbol: '💀', meaning: '结束，蜕变，放下旧有', number: 'XIII' },
  { name: '节制', symbol: '🏺', meaning: '平衡，调和，中庸之道', number: 'XIV' },
  { name: '恶魔', symbol: '🔗', meaning: '束缚，欲望，面对阴影', number: 'XV' },
  { name: '高塔', symbol: '⚡', meaning: '突变，觉醒，打破幻象', number: 'XVI' },
  { name: '星星', symbol: '⭐', meaning: '希望，疗愈，灵性连接', number: 'XVII' },
  { name: '月亮', symbol: '🌑', meaning: '幻觉，恐惧，潜意识深处', number: 'XVIII' },
  { name: '太阳', symbol: '☀', meaning: '快乐，成功，生命力', number: 'XIX' },
  { name: '审判', symbol: '📯', meaning: '觉醒，重生，回应召唤', number: 'XX' },
  { name: '世界', symbol: '🌍', meaning: '完成，圆满，新的循环', number: 'XXI' }
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startDraw() {
  // Pick 6 random cards for the draw pool
  const shuffled = shuffle(majorArcana);
  drawCards.value = shuffled.slice(0, 6).map(c => ({ ...c, revealed: false }));
  selectedCards.value = [];
  revealedCards.value = [];
  stage.value = 'draw';
}

function pickCard(card, i) {
  if (card.revealed) return;
  if (selectedCards.value.includes(i)) {
    selectedCards.value = selectedCards.value.filter(idx => idx !== i);
  } else if (selectedCards.value.length < 3) {
    selectedCards.value = [...selectedCards.value, i];
  }
}

function revealAll() {
  const cards = [...drawCards.value];
  selectedCards.value.forEach(i => {
    cards[i].revealed = true;
  });
  drawCards.value = [...cards];
  revealedCards.value = selectedCards.value.map(i => ({
    ...drawCards.value[i],
    revealed: true
  }));
  stage.value = 'reading';
}

function resetDraw() {
  stage.value = 'intro';
  drawCards.value = [];
  selectedCards.value = [];
  revealedCards.value = [];
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}
</script>

<style lang="scss" scoped>
.page-tarot {
  padding-bottom: 120rpx + env(safe-area-inset-bottom);
}

/* Stage 1: Intro */
.tarot-intro {
  display: flex; flex-direction: column; align-items: center;
  padding: 120rpx 48rpx 0;
}
.intro-icon { font-size: 80rpx; margin-bottom: 24rpx; }
.intro-title {
  font-size: 52rpx; font-weight: bold;
  background: linear-gradient(180deg, #F0C99A 0%, #D4A574 50%, #B8865A 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 32rpx;
}
.intro-desc {
  font-size: 26rpx; color: #AAAACC; text-align: center;
  line-height: 1.8; white-space: pre-wrap;
  margin-bottom: 48rpx;
}
.intro-btn {
  padding: 22rpx 56rpx; border-radius: 40rpx;
  font-size: 30rpx; color: #F0E6FF; cursor: pointer;
}

/* Stage 2: Draw */
.tarot-draw {
  padding: 60rpx 20rpx 0;
  display: flex; flex-direction: column; align-items: center;
}
.draw-title {
  font-size: 34rpx; font-weight: bold; color: #F0E6FF; margin-bottom: 8rpx;
}
.draw-sub {
  font-size: 24rpx; color: #D4A574; margin-bottom: 40rpx;
}
.draw-grid {
  display: flex; flex-wrap: wrap;
  justify-content: center; gap: 24rpx;
  padding: 0 16rpx; margin-bottom: 40rpx;
}
.draw-card-item {
  transition: transform 0.3s, box-shadow 0.3s;
}
.draw-card-item.is-picked {
  transform: translateY(-12rpx);
  filter: drop-shadow(0 8rpx 24rpx rgba(212,165,116,0.35));
}
.reveal-btn {
  padding: 20rpx 52rpx; border-radius: 40rpx;
  font-size: 30rpx; color: #F0E6FF; cursor: pointer;
}

/* Stage 3: Reading */
.tarot-reading {
  padding: 60rpx 24rpx 0;
  display: flex; flex-direction: column; align-items: center;
}
.reading-title {
  font-size: 36rpx; font-weight: bold;
  background: linear-gradient(180deg, #F0C99A, #D4A574);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 36rpx;
}
.reading-cards {
  display: flex; gap: 16rpx;
  padding: 0 8rpx; margin-bottom: 32rpx;
}
.reading-card-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; padding: 28rpx 12rpx 20rpx;
}
.reading-card-header {
  margin-bottom: 12rpx;
}
.reading-position {
  font-size: 20rpx; color: #D4A574;
  background: rgba(212,165,116,0.12);
  padding: 4rpx 16rpx; border-radius: 16rpx;
}
.reading-symbol { font-size: 48rpx; margin-bottom: 8rpx; }
.reading-name { font-size: 22rpx; color: #F0E6FF; font-weight: bold; text-align: center; margin-bottom: 12rpx; }
.reading-divider {
  width: 40rpx; height: 1rpx;
  background: rgba(212,165,116,0.2);
  margin-bottom: 10rpx;
}
.reading-meaning { font-size: 18rpx; color: #AAAACC; text-align: center; line-height: 1.5; }

.reading-summary {
  font-size: 24rpx; color: #8888AA; text-align: center;
  line-height: 1.7; white-space: pre-wrap;
  margin-bottom: 40rpx; padding: 0 16rpx;
}
.reading-actions {
  display: flex; gap: 24rpx;
}
.action-btn {
  padding: 18rpx 36rpx; border-radius: 40rpx;
  font-size: 24rpx; color: #CCC; cursor: pointer;
}

.disclaimer { display: block; text-align: center; font-size: 20rpx; color: #555; padding: 32rpx 0; position: relative; z-index: 2; }
</style>
