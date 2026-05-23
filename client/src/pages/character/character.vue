<template>
  <view class="page-character">
    <StarryBackground />
    <!-- Step 1: Select Zodiac -->
    <view v-if="step === 1" class="step fade-in">
      <text class="step-title">🎭 角色匹配</text>
      <text class="step-desc">先选择你的星座，再回答10道趣味问题
看看哪个猎奇角色最懂你</text>
      <view class="zodiac-grid">
        <view
          v-for="z in zodiacList"
          :key="z.id"
          class="zodiac-item"
          :class="{ selected: selectedZodiac === z.name }"
          @click="selectedZodiac = z.name"
        >
          <text class="z-emoji">{{ z.emoji }}</text>
          <text class="z-name">{{ z.name }}</text>
        </view>
      </view>
      <view
        class="btn btn-accent step-btn"
        :class="{ disabled: !selectedZodiac }"
        @click="startQuiz"
      >
        开始答题 →
      </view>
    </view>

    <!-- Step 2: Quiz -->
    <view v-if="step === 2" class="step fade-in">
      <text class="step-title">第 {{ currentQ + 1 }} / {{ questions.length }} 题</text>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: ((currentQ + 1) / questions.length * 100) + '%' }" />
      </view>
      <text class="q-text">{{ questions[currentQ]?.text }}</text>
      <view class="options">
        <view
          v-for="opt in questions[currentQ]?.options"
          :key="opt.key"
          class="option-item"
          :class="{ active: answers[currentQ] === opt.key }"
          @click="selectOption(opt.key)"
        >
          <text class="opt-key">{{ opt.key }}</text>
          <text class="opt-text">{{ opt.text }}</text>
        </view>
      </view>
      <view class="quiz-nav">
        <view v-if="currentQ > 0" class="btn btn-outline" @click="currentQ--">← 上一题</view>
        <view v-if="currentQ < questions.length - 1 && answers[currentQ]" class="btn btn-accent" @click="currentQ++">下一题 →</view>
        <view v-if="allAnswered" class="btn btn-primary" @click="submitQuiz">🔮 查看结果</view>
      </view>
    </view>

    <!-- Step 3: Loading -->
    <view v-if="step === 3" class="step loading-step">
      <LoadingWrapper :loading="true" text="正在召唤你的专属角色..." />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import StarryBackground from '@/components/StarryBackground.vue';
import LoadingWrapper from '@/components/LoadingWrapper.vue';
import { getZodiacList } from '@/api/zodiac';
import { matchCharacter } from '@/api/character';

const step = ref(1);
const selectedZodiac = ref('');
const zodiacList = ref([]);
const currentQ = ref(0);
const answers = ref([]);
const questions = ref([]);

const allAnswered = computed(() => answers.value.filter(Boolean).length === questions.value.length);

onMounted(async () => {
  try {
    zodiacList.value = await getZodiacList();
  } catch (e) {}
  // Load quiz questions from API or local
  questions.value = [
    { text: '周末你最想怎么过？', options: [
      { key: 'A', text: '户外冒险，去没去过的地方' },
      { key: 'B', text: '安静看本书或研究感兴趣的东西' },
      { key: 'C', text: '约朋友聚会或参加活动' },
      { key: 'D', text: '在家舒服地待着，享受独处时光' }
    ]},
    { text: '遇到困难你通常会？', options: [
      { key: 'A', text: '直接冲，干就完了' },
      { key: 'B', text: '冷静分析各种可能的方案' },
      { key: 'C', text: '找朋友或同事商量' },
      { key: 'D', text: '等等看，时机到了自然能解决' }
    ]},
    { text: '你更喜欢哪种颜色？', options: [
      { key: 'A', text: '热烈的红色或橙色' },
      { key: 'B', text: '深邃的蓝色或紫色' },
      { key: 'C', text: '温暖的黄色或粉色' },
      { key: 'D', text: '沉稳的绿色或灰色' }
    ]},
    { text: '哪种描述最像你？', options: [
      { key: 'A', text: '行动派——想到就做' },
      { key: 'B', text: '思考者——喜欢分析和深入理解' },
      { key: 'C', text: '社交达人——和人相处让我充电' },
      { key: 'D', text: '倾听者——安静陪伴也是一种力量' }
    ]},
    { text: '你最看重什么？', options: [
      { key: 'A', text: '自由——不被束缚做想做的事' },
      { key: 'B', text: '成就——实现目标获得认可' },
      { key: 'C', text: '关系——和家人朋友的紧密连接' },
      { key: 'D', text: '安全——稳定的生活和内心安宁' }
    ]},
    { text: '你理想中的一天？', options: [
      { key: 'A', text: '充满刺激和惊喜' },
      { key: 'B', text: '学到新东西，有收获感' },
      { key: 'C', text: '被朋友需要，和大家在一起' },
      { key: 'D', text: '平静舒适，没有压力' }
    ]},
    { text: '面对刚认识的人，你通常会？', options: [
      { key: 'A', text: '主动介绍自己，打开话匣子' },
      { key: 'B', text: '先观察对方，判断该怎么沟通' },
      { key: 'C', text: '找共同话题，迅速拉近距离' },
      { key: 'D', text: '微笑回应，保持舒适的距离' }
    ]},
    { text: '哪种工作环境最适合你？', options: [
      { key: 'A', text: '快节奏、结果导向，每天不一样' },
      { key: 'B', text: '安静独立的空间，深度钻研' },
      { key: 'C', text: '团队紧密协作、氛围活跃' },
      { key: 'D', text: '稳定有序、压力可控的节奏' }
    ]},
    { text: '面对重要决定时，你更相信？', options: [
      { key: 'A', text: '直觉——第一感觉往往是对的' },
      { key: 'B', text: '数据——充分分析和推演再决定' },
      { key: 'C', text: '朋友——听听身边人的看法' },
      { key: 'D', text: '时间——让子弹飞一会儿' }
    ]},
    { text: '哪种情况会让你最不安？', options: [
      { key: 'A', text: '被限制自由，不能随心所欲' },
      { key: 'B', text: '在不了解的领域被迫做决定' },
      { key: 'C', text: '长时间没有社交和互动' },
      { key: 'D', text: '计划被打乱，充满不确定性' }
    ]}
  ];
});

function startQuiz() {
  if (!selectedZodiac.value) return;
  step.value = 2;
}

function selectOption(key) {
  answers.value[currentQ.value] = key;
}

async function submitQuiz() {
  step.value = 3;
  try {
    const result = await matchCharacter(selectedZodiac.value, answers.value);
    const data = encodeURIComponent(JSON.stringify(result));
    uni.navigateTo({ url: '/pages/result/result?data=' + data });
  } catch (e) {
    uni.showToast({ title: '匹配失败，请重试', icon: 'none' });
    step.value = 2;
  }
}
</script>

<style lang="scss" scoped>
.page-character {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 0 32rpx 120rpx;
}
.step { position: relative; z-index: 2; }
.step-title { display: block; text-align: center; font-size: 40rpx; font-weight: bold; color: #D4A574; padding: 60rpx 0 12rpx; }
.step-desc { display: block; text-align: center; font-size: 26rpx; color: #999; line-height: 1.7; padding: 0 40rpx 40rpx; white-space: pre-wrap; }

.zodiac-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx;
  margin-bottom: 40rpx;
}
.zodiac-item {
  display: flex; flex-direction: column; align-items: center;
  padding: 24rpx 8rpx;
  background: rgba(255,255,255,0.05); border-radius: 16rpx;
  border: 2rpx solid transparent; transition: all 0.2s;
}
.zodiac-item.selected { background: rgba(212,165,116,0.12); border-color: #D4A574; }
.z-emoji { font-size: 40rpx; margin-bottom: 6rpx; }
.z-name { font-size: 22rpx; color: #CCC; }

.step-btn { width: 400rpx; margin: 0 auto; padding: 24rpx; font-size: 30rpx; }
.step-btn.disabled { opacity: 0.4; }

.progress-bar { height: 6rpx; background: rgba(255,255,255,0.1); border-radius: 3rpx; margin: 20rpx 0 40rpx; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #6B5B9A, #D4A574); border-radius: 3rpx; transition: width 0.3s; }

.q-text { display: block; font-size: 34rpx; color: #EEE; text-align: center; padding: 0 24rpx 36rpx; line-height: 1.6; }

.options { display: flex; flex-direction: column; gap: 20rpx; }
.option-item {
  display: flex; align-items: center; gap: 20rpx;
  padding: 28rpx 28rpx;
  background: rgba(255,255,255,0.05); border-radius: 16rpx;
  border: 2rpx solid rgba(255,255,255,0.08);
  transition: all 0.2s;
}
.option-item.active { background: rgba(212,165,116,0.12); border-color: #D4A574; }
.opt-key { font-size: 32rpx; font-weight: bold; color: #D4A574; min-width: 48rpx; }
.opt-text { font-size: 28rpx; color: #DDD; }

.quiz-nav { display: flex; justify-content: center; gap: 24rpx; margin-top: 48rpx; }
.quiz-nav .btn { padding: 20rpx 40rpx; font-size: 28rpx; }

.loading-step { padding-top: 200rpx; }

.fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20rpx); } to { opacity: 1; transform: translateY(0); } }
</style>
