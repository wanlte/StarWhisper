<template>
  <view class="page-tarot page-bg">
    <StarryBackground />

    <!-- Stage 1: Intro -->
    <view v-if="stage === 'intro'" class="tarot-intro content-layer">
      <view class="intro-icon anim-float">🌙</view>
      <text class="intro-title glow-text">塔罗占卜</text>
      <view v-if="isPremium" class="premium-badge">
        <text>✦ 高级占卜 ✦</text>
      </view>
      <text class="intro-desc">
        <template v-if="isPremium">
          静心凝神，将你的问题默念于心{'\n'}
          从九张牌中，选择五张与你感应最强的牌{'\n'}
          获得更全面深入的塔罗指引
        </template>
        <template v-else>
          静心凝神，将你的问题默念于心{'\n'}
          然后从六张牌中，选择三张感应最强的牌
        </template>
      </text>
      <view class="intro-btn glass-card-interactive" @click="startDraw">
        <text>✨ 开始抽牌</text>
      </view>
    </view>

    <!-- Stage 2: Draw -->
    <view v-if="stage === 'draw'" class="tarot-draw content-layer">
      <text class="draw-title">选择{{ isPremium ? '五' : '三' }}张与你感应的牌</text>
      <text class="draw-sub">已选 {{ selectedCards.length }} / {{ isPremium ? 5 : 3 }}</text>

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
        v-if="selectedCards.length === (isPremium ? 5 : 3)"
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

      <!-- Comprehensive interpretation -->
      <view class="reading-insight-box">
        <view class="insight-header">
          <text class="insight-icon">🔮</text>
          <text class="insight-title">综合解读</text>
        </view>
        <text class="insight-content">{{ readingInsight }}</text>
      </view>

      <!-- Action recommendation -->
      <view class="reading-advice-box">
        <view class="advice-header">
          <text class="advice-icon">💫</text>
          <text class="advice-title">行动建议</text>
        </view>
        <text class="advice-content">{{ readingAdvice }}</text>
      </view>

      <!-- Key takeaway -->
      <view class="reading-key-box">
        <view class="key-header">
          <text class="key-icon">✨</text>
          <text class="key-title">关键提示</text>
        </view>
        <text class="key-content">{{ keyTakeaway }}</text>
      </view>

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
import { ref, computed } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import TarotCard from '@/components/TarotCard.vue';

const stage = ref('intro');
const drawCards = ref([]);
const selectedCards = ref([]);
const revealedCards = ref([]);

// Read type query param (regular / premium)
const pages = getCurrentPages();
const query = pages[pages.length - 1]?.options || {};
const isPremium = computed(() => query.type === 'premium');

const positions = computed(() =>
  isPremium.value
    ? ['现状', '挑战', '过去', '未来', '建议']
    : ['过去', '现在', '未来']
);

// Generate comprehensive interpretation based on revealed cards
const readingInsight = computed(() => {
  if (revealedCards.value.length === 0) return '';
  const cards = revealedCards.value;
  if (cards.length === 3) {
    return `从牌面来看，过去的"${cards[0].name}"暗示着${cards[0].meaning.split('，')[0]}的经历在长久影响着你。`
      + `而现在"${cards[1].name}"的出现表明你正处在${cards[1].meaning.split('，')[0]}的关键节点。`
      + `未来"${cards[2].name}"则指引着${cards[2].meaning.split('，')[0]}的方向。`
      + `三张牌的流转揭示了一条清晰的因果脉络：过去的经历塑造了当下的选择，而当下的行动正铺就通向未来的道路。`;
  }
  // Premium 5-card reading
  return `这是一次深度的五牌解读。现状"${cards[0].name}"揭示${cards[0].meaning.split('，')[0]}正是当下核心。`
    + `挑战"${cards[1].name}"指出${cards[1].meaning.split('，')[0]}是必须面对的考验。`
    + `过去"${cards[2].name}"表明${cards[2].meaning.split('，')[0]}如同一颗种子，早已埋下今日的局面。`
    + `未来"${cards[3].name}"预示${cards[3].meaning.split('，')[0]}。`
    + `建议"${cards[4].name}"则是宇宙给你的直接提示。`;
});

// Generate actionable advice
const readingAdvice = computed(() => {
  if (revealedCards.value.length === 0) return '';
  const map = revealedCards.value.map(c => c.name);
  const themes = revealedCards.value.map(c => c.meaning);

  if (map.some(n => ['死神', '高塔', '倒吊人'].includes(n))) {
    return '牌面中出现了变革之牌，当下的关键不在于奋力向前，而在于放下执着、接受变化。'
      + '给自己一些安静的时间，审视内心真正的渴望，而非外界赋予的期望。'
      + '改变虽然令人不安，却是通往更高阶段的必经之路。';
  }
  if (map.some(n => ['星星', '太阳', '世界'].includes(n))) {
    return '星光照耀着你的道路，这是充满希望与活力的时期。'
      + '大胆地迈出步伐，相信自己的直觉与能力。'
      + '在行动中保持感恩之心，好运将不期而至。保持开放，迎接生命中的美好奇迹。';
  }
  if (map.some(n => ['恋人', '女皇', '女祭司'].includes(n))) {
    return '人际关系与内在智慧是当下的焦点。倾听你内心的声音，它比你想象的更有智慧。'
      + '在与他人互动中寻找平衡，既不失去自我，也不拒绝连接。'
      + '慢下来，让每一次选择都源自真心而非焦虑。';
  }
  if (map.some(n => ['魔术师', '战车', '力量'].includes(n))) {
    return '你拥有超乎想象的能力与资源。现在是集中精力、果敢行动的时刻。'
      + '不要让恐惧阻挡你的脚步——你所需要的一切早已在你手中。'
      + '以温柔而坚定的方式驾驭你的力量，胜利属于有耐心和勇气的灵魂。';
  }
  if (map.some(n => ['隐者', '正义', '节制'].includes(n))) {
    return '向内探索比向外追寻更能带来答案。这段时间适合反思、学习与整合。'
      + '做出每一个决定前先问自己：这符合我内心真正的价值观吗？'
      + '耐心地调和生活中的矛盾面，中庸之道将指引你走向和谐。';
  }
  return '综合所有牌面的指引，建议你保持开放的心态，接纳不确定性。'
    + '每一个变化都蕴含着成长的机会。相信过程，也相信自己的判断力。'
    + '当下最重要的是：觉察自己的情绪，然后带着觉知做出每一个微小选择。';
});

// Key takeaway - a single memorable insight
const keyTakeaway = computed(() => {
  if (revealedCards.value.length === 0) return '';
  const firstCard = revealedCards.value[0];
  const lastCard = revealedCards.value[revealedCards.value.length - 1];
  const insights = [
    `"${firstCard.name}"提醒你：${firstCard.meaning.split('，')[0]}。`,
    `命运的低语：从"${firstCard.name}"到"${lastCard.name}"，这是一段关于成长的旅程。`,
    `所有的牌都指向同一个真理：答案不在牌中，而在你心中。`,
    `深呼吸，此刻的你已经拥有了面对一切的力量。`,
    `塔罗揭示的不是宿命，而是你内心深处早已知道的真相。`,
    `"${lastCard.name}"是你的北极星——${lastCard.meaning.split('，')[0]}。`,
  ];
  // Pick based on a simple deterministic hash of card names
  const hash = revealedCards.value.reduce((s, c) => s + c.name.length, 0);
  return insights[hash % insights.length];
});

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

const poolSize = computed(() => isPremium.value ? 9 : 6);
const pickCount = computed(() => isPremium.value ? 5 : 3);

function startDraw() {
  const shuffled = shuffle(majorArcana);
  drawCards.value = shuffled.slice(0, poolSize.value).map(c => ({ ...c, revealed: false }));
  selectedCards.value = [];
  revealedCards.value = [];
  stage.value = 'draw';
}

function pickCard(card, i) {
  if (card.revealed) return;
  if (selectedCards.value.includes(i)) {
    selectedCards.value = selectedCards.value.filter(idx => idx !== i);
  } else if (selectedCards.value.length < pickCount.value) {
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
  margin-bottom: 16rpx;
}
.premium-badge {
  margin-bottom: 24rpx;
  padding: 6rpx 24rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, rgba(212,165,116,0.18), rgba(240,201,154,0.08));
  border: 1rpx solid rgba(212,165,116,0.3);
  font-size: 22rpx;
  color: #F0C99A;
  letter-spacing: 4rpx;
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

/* ── Comprehensive Insight Box ── */
.reading-insight-box,
.reading-advice-box,
.reading-key-box {
  width: 100%;
  max-width: 640rpx;
  border-radius: 18rpx;
  padding: 24rpx 22rpx;
  margin-bottom: 20rpx;
  position: relative;
  overflow: hidden;
}
.reading-insight-box {
  background: linear-gradient(160deg,
    rgba(40, 20, 80, 0.5) 0%,
    rgba(25, 12, 60, 0.55) 100%
  );
  border: 1rpx solid rgba(180, 150, 220, 0.22);
}
.reading-advice-box {
  background: linear-gradient(160deg,
    rgba(25, 50, 40, 0.45) 0%,
    rgba(15, 35, 28, 0.5) 100%
  );
  border: 1rpx solid rgba(140, 200, 170, 0.2);
}
.reading-key-box {
  background: linear-gradient(160deg,
    rgba(60, 30, 20, 0.45) 0%,
    rgba(45, 20, 12, 0.5) 100%
  );
  border: 1rpx solid rgba(220, 170, 130, 0.25);
  margin-bottom: 36rpx;
}
.insight-header,
.advice-header,
.key-header {
  display: flex; align-items: center; gap: 8rpx; margin-bottom: 14rpx;
}
.insight-icon, .advice-icon, .key-icon { font-size: 28rpx; }
.insight-title {
  font-size: 26rpx; font-weight: bold;
  color: #D0B8E8;
}
.advice-title {
  font-size: 26rpx; font-weight: bold;
  color: #90D0B0;
}
.key-title {
  font-size: 26rpx; font-weight: bold;
  color: #E8C090;
}
.insight-content, .advice-content, .key-content {
  font-size: 22rpx; color: #B0A0C8;
  line-height: 1.75;
}
.advice-content { color: #A0C0B0; }
.key-content { color: #D0B0A0; font-weight: 500; }
</style>
