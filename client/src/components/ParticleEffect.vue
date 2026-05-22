<template>
  <view v-if="active" class="particle-stage">
    <view
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        left: p.x + 'rpx',
        top: p.y + 'rpx',
        width: p.size + 'rpx',
        height: p.size + 'rpx',
        background: p.color,
        opacity: p.opacity,
        animationDuration: p.duration + 's',
        animationDelay: p.delay + 's'
      }"
    />
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  active: { type: Boolean, default: true },
  count: { type: Number, default: 30 }
});

const particles = ref([]);

let timer = null;

function spawn() {
  const arr = [];
  for (let i = 0; i < props.count; i++) {
    arr.push({
      id: i,
      x: Math.random() * 750,
      y: Math.random() * 1000,
      size: 4 + Math.random() * 10,
      color: ['#D4A574', '#6B5B9A', '#F0C99A', '#8B7DBA', '#FFFFFF'][Math.floor(Math.random() * 5)],
      opacity: 0.3 + Math.random() * 0.7,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 2
    });
  }
  particles.value = arr;
}

onMounted(() => {
  spawn();
  if (props.active) {
    timer = setInterval(spawn, 5000);
  }
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.particle-stage {
  position: fixed; inset: 0; z-index: 1;
  overflow: hidden; pointer-events: none;
}
.particle {
  position: absolute;
  border-radius: 50%;
  animation: rise ease-out forwards;
}
@keyframes rise {
  0% { transform: translateY(0) scale(1); opacity: var(--opacity, 0.7); }
  100% { transform: translateY(-300rpx) scale(0); opacity: 0; }
}
</style>
