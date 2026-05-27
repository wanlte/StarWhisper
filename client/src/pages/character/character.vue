<template>
  <view class="page-character page-bg">
    <StarryBackground />
    <!-- Step 1: Select Zodiac -->
    <view v-if="step === 1" class="step content-layer fade-in">
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
    <view v-if="step === 2" class="step content-layer fade-in">
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
    <view v-if="step === 3" class="step content-layer loading-step">
      <LoadingWrapper :loading="true" text="正在召唤你的专属角色..." />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import StarryBackground from '@/components/StarryBackground.vue';
import LoadingWrapper from '@/components/LoadingWrapper.vue';
import { getZodiacList } from '@/api/zodiac';
import { matchCharacter, getQuestions } from '@/api/character';

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
  // Fetch 10 random questions from cloud function
  try {
    questions.value = await getQuestions();
    answers.value = new Array(questions.value.length).fill(null);
  } catch (e) {
    // Fallback to empty, user will see error
  }
});

onShow(() => {
  if (step.value === 3) {
    step.value = 1;
    currentQ.value = 0;
    answers.value = [];
  }
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
    const answerObjs = answers.value.map((key, i) => ({
      questionId: questions.value[i].id,
      key
    }));
    const result = await matchCharacter(selectedZodiac.value, answerObjs);
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
  padding: 0 32rpx 120rpx;
}
.step { }
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
