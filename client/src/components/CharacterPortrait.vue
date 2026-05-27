<template>
  <view class="portrait" :style="portraitStyle">
    <!-- Animated border glow -->
    <view class="portrait-border-glow" :style="borderGlowStyle" />

    <!-- Background atmosphere layer -->
    <view class="atmo-layer">
      <view class="atmo-orb atmo-orb--1" :style="orbStyle(1)" />
      <view class="atmo-orb atmo-orb--2" :style="orbStyle(2)" />
      <view class="atmo-orb atmo-orb--3" :style="orbStyle(3)" />
      <view class="atmo-orb atmo-orb--4" :style="orbStyle(4)" />
    </view>

    <!-- Geometric decoration layer -->
    <view class="geo-layer">
      <!-- Adventure: chaotic energy -->
      <template v-if="dominant === 'adventure'">
        <view class="geo-tri geo-tri--1" />
        <view class="geo-tri geo-tri--2" />
        <view class="geo-tri geo-tri--3" />
        <view class="geo-tri geo-tri--4" />
        <view v-for="n in 10" :key="'spk-'+n" class="spark-particle"
          :style="{ left: (5 + ((n * 37 + 13) % 85)) + '%', top: (3 + ((n * 29 + 7) % 88)) + '%', animationDelay: ((n * 0.22) % 2) + 's' }"
        />
        <view class="geo-crack geo-crack--1" />
        <view class="geo-crack geo-crack--2" />
      </template>

      <!-- Thought: sacred geometry -->
      <template v-if="dominant === 'thought'">
        <view class="geo-ring geo-ring--1" />
        <view class="geo-ring geo-ring--2" />
        <view class="geo-ring geo-ring--3" />
        <view class="geo-hex" />
        <view class="geo-eye">
          <view class="geo-eye-inner" />
        </view>
        <view v-for="n in 6" :key="'orb-'+n" class="thought-orb"
          :style="{ left: (10 + ((n * 51 + 19) % 75)) + '%', top: (8 + ((n * 37 + 11) % 78)) + '%', animationDelay: ((n * 0.4) % 2) + 's', width: (4 + (n % 3) * 3) + 'rpx', height: (4 + (n % 3) * 3) + 'rpx' }"
        />
      </template>

      <!-- Social: pulsing network -->
      <template v-if="dominant === 'social'">
        <view class="geo-bubble geo-bubble--1" />
        <view class="geo-bubble geo-bubble--2" />
        <view class="geo-bubble geo-bubble--3" />
        <view class="geo-bubble geo-bubble--4" />
        <view v-for="n in 8" :key="'nd-'+n" class="node-dot"
          :style="{ left: (8 + ((n * 23 + 7) % 78)) + '%', top: (6 + ((n * 31 + 11) % 82)) + '%' }" />
        <view class="node-line node-line--1" />
        <view class="node-line node-line--2" />
        <view class="node-line node-line--3" />
        <view class="node-line node-line--4" />
      </template>

      <!-- Rest: surreal dreamscape -->
      <template v-if="dominant === 'rest'">
        <view class="geo-wave geo-wave--1" />
        <view class="geo-wave geo-wave--2" />
        <view class="geo-wave geo-wave--3" />
        <view class="geo-oval geo-oval--1" />
        <view class="geo-oval geo-oval--2" />
        <view class="geo-oval geo-oval--3" />
        <view v-for="n in 6" :key="'zp-'+n" class="zen-particle"
          :style="{ left: (8 + ((n * 42 + 17) % 75)) + '%', top: (50 + ((n * 13 + 3) % 35)) + '%', animationDelay: ((n * 1.1) % 5) + 's', width: (2 + (n % 3) * 2) + 'rpx', height: (2 + (n % 3) * 2) + 'rpx' }"
        />
        <view class="geo-spiral" />
      </template>
    </view>

    <!-- Corner ornaments -->
    <view class="corner-orn corner-orn--tl" />
    <view class="corner-orn corner-orn--tr" />
    <view class="corner-orn corner-orn--bl" />
    <view class="corner-orn corner-orn--br" />

    <!-- Emoji focal point -->
    <view class="emoji-stage">
      <view class="emoji-glow" :style="emojiGlowStyle" />
      <view class="emoji-aura" :style="emojiAuraStyle" />
      <text class="portrait-emoji">{{ character.emoji || '🎭' }}</text>
    </view>

    <!-- Vignette overlay -->
    <view class="vignette" />
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  character: { type: Object, required: true }
});

const dominant = computed(() => {
  const attrs = props.character.attributes || {};
  const entries = Object.entries(attrs);
  if (entries.length === 0) return 'rest';
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
});

const attrColors = {
  adventure: { from: '#4A150A', to: '#B8401A', glow: 'rgba(255, 130, 40, 0.55)', accent: '#F08030', dark: '#6B2010', mid: '#C84820' },
  thought:   { from: '#0A0E3A', to: '#1E2D90', glow: 'rgba(80, 120, 240, 0.55)', accent: '#5080E0', dark: '#101860', mid: '#2A40B0' },
  social:    { from: '#2A0A30', to: '#802870', glow: 'rgba(230, 100, 180, 0.55)', accent: '#D060A0', dark: '#3D1840', mid: '#A03080' },
  rest:      { from: '#0A2A20', to: '#1A6050', glow: 'rgba(80, 210, 150, 0.55)', accent: '#40C090', dark: '#0D3830', mid: '#208060' }
};

const colors = computed(() => attrColors[dominant.value] || attrColors.rest);

const portraitStyle = computed(() => ({
  background: `linear-gradient(170deg, ${colors.value.from} 0%, ${colors.value.dark} 30%, ${colors.value.to} 70%, ${colors.value.mid} 100%)`
}));

const borderGlowStyle = computed(() => ({
  boxShadow: `0 0 16rpx 3rpx ${colors.value.glow}, 0 0 40rpx 8rpx ${colors.value.glow.replace('0.55', '0.18')}`
}));

const emojiGlowStyle = computed(() => ({
  boxShadow: `0 0 40rpx 12rpx ${colors.value.glow}, 0 0 80rpx 24rpx ${colors.value.glow.replace('0.55', '0.2')}`
}));

const emojiAuraStyle = computed(() => ({
  background: `radial-gradient(circle, ${colors.value.accent}33 0%, ${colors.value.accent}11 40%, transparent 70%)`
}));

function orbStyle(n) {
  const sizes = [110, 75, 90, 55];
  const ops = [0.2, 0.13, 0.16, 0.1];
  const pos = [
    { top: '-20%', left: '-12%' },
    { bottom: '-12%', right: '-10%' },
    { top: '35%', left: '65%' },
    { bottom: '25%', left: '-15%' }
  ];
  return {
    width: sizes[n - 1] + 'rpx',
    height: sizes[n - 1] + 'rpx',
    opacity: ops[n - 1],
    background: `radial-gradient(circle at center, ${colors.value.accent} 0%, ${colors.value.accent}44 30%, transparent 65%)`,
    ...pos[n - 1]
  };
}
</script>

<style lang="scss" scoped>
.portrait {
  position: relative;
  width: 300rpx;
  height: 300rpx;
  border-radius: 36rpx;
  overflow: hidden;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 0 24rpx rgba(0, 0, 0, 0.35),
    0 6rpx 30rpx rgba(0, 0, 0, 0.25);
}

.portrait-border-glow {
  position: absolute; inset: -1rpx;
  border-radius: 36rpx;
  z-index: 4; pointer-events: none;
  animation: border-pulse 3s ease-in-out infinite alternate;
}
@keyframes border-pulse {
  0% { opacity: 0.6; }
  100% { opacity: 1; }
}

/* ── Atmosphere orbs ── */
.atmo-layer { position: absolute; inset: 0; z-index: 0; }
.atmo-orb {
  position: absolute; border-radius: 50%; pointer-events: none;
  animation: atmo-pulse 3s ease-in-out infinite alternate;
  filter: blur(8rpx);
}
.atmo-orb--1 { animation-duration: 3s; }
.atmo-orb--2 { animation-duration: 4s; animation-delay: 0.6s; }
.atmo-orb--3 { animation-duration: 3.5s; animation-delay: 1.1s; }
.atmo-orb--4 { animation-duration: 4.5s; animation-delay: 0.3s; }

@keyframes atmo-pulse {
  0% { transform: scale(1); opacity: 0.08; }
  100% { transform: scale(1.2); opacity: 0.28; }
}

/* ── Corner ornaments ── */
.corner-orn {
  position: absolute; z-index: 3; pointer-events: none;
  width: 20rpx; height: 20rpx;
  border-color: rgba(255, 255, 255, 0.15);
  border-style: solid;
}
.corner-orn--tl { top: 8rpx; left: 8rpx; border-width: 1rpx 0 0 1rpx; border-radius: 4rpx 0 0 0; }
.corner-orn--tr { top: 8rpx; right: 8rpx; border-width: 1rpx 1rpx 0 0; border-radius: 0 4rpx 0 0; }
.corner-orn--bl { bottom: 8rpx; left: 8rpx; border-width: 0 0 1rpx 1rpx; border-radius: 0 0 0 4rpx; }
.corner-orn--br { bottom: 8rpx; right: 8rpx; border-width: 0 1rpx 1rpx 0; border-radius: 0 0 4rpx 0; }

/* ── Geometric decorations ── */
.geo-layer { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

/* Adventure: chaotic triangles + cracks */
.geo-tri {
  position: absolute; width: 0; height: 0;
  border-left: 18rpx solid transparent;
  border-right: 18rpx solid transparent;
  border-bottom: 32rpx solid;
  opacity: 0.14;
}
.geo-tri--1 { top: 6%; left: 10%; transform: rotate(15deg); }
.geo-tri--2 { top: 55%; right: 8%; transform: rotate(-40deg); border-bottom-width: 24rpx; }
.geo-tri--3 { bottom: 18%; left: 45%; transform: rotate(75deg); border-bottom-width: 20rpx; }
.geo-tri--4 { top: 20%; right: 25%; transform: rotate(-10deg); border-bottom-width: 16rpx; opacity: 0.08; }

.geo-crack {
  position: absolute; height: 1.5rpx;
  background: rgba(255, 180, 120, 0.3);
  transform-origin: left center;
  box-shadow: 0 0 3rpx rgba(255, 150, 80, 0.2);
}
.geo-crack--1 { top: 42%; left: 5%; width: 80rpx; transform: rotate(18deg); }
.geo-crack--2 { top: 68%; left: 20%; width: 60rpx; transform: rotate(-12deg); }

.spark-particle {
  position: absolute;
  width: 4rpx; height: 4rpx;
  background: rgba(255, 200, 100, 0.7);
  border-radius: 50%;
  animation: spark-flicker 1.1s ease-in-out infinite alternate;
}
@keyframes spark-flicker {
  0% { opacity: 0.05; transform: scale(1); }
  100% { opacity: 0.8; transform: scale(3); }
}

/* Thought: sacred geometry + all-seeing eye */
.geo-ring {
  position: absolute; border-radius: 50%;
  border: 1.2rpx solid rgba(255, 255, 255, 0.1);
  left: 50%; top: 50%; transform: translate(-50%, -50%);
  animation: ring-pulse 4s ease-in-out infinite alternate;
}
.geo-ring--1 { width: 260rpx; height: 260rpx; }
.geo-ring--2 { width: 200rpx; height: 200rpx; animation-delay: 0.5s; }
.geo-ring--3 { width: 140rpx; height: 140rpx; animation-delay: 1s; }

@keyframes ring-pulse {
  0% { border-color: rgba(255, 255, 255, 0.06); }
  100% { border-color: rgba(255, 255, 255, 0.15); }
}

.geo-hex {
  position: absolute; left: 50%; top: 50%;
  width: 120rpx; height: 70rpx;
  background: rgba(255, 255, 255, 0.03);
  border: 1rpx solid rgba(255, 255, 255, 0.06);
  transform: translate(-50%, -50%) rotate(90deg);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: hex-drift 8s linear infinite;
}
@keyframes hex-drift {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.geo-eye {
  position: absolute; left: 50%; top: 50%;
  width: 40rpx; height: 20rpx;
  transform: translate(-50%, -50%);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}
.geo-eye-inner {
  width: 12rpx; height: 12rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6rpx 3rpx rgba(255, 255, 255, 0.08);
}

.thought-orb {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: thought-float 3s ease-in-out infinite alternate;
}
@keyframes thought-float {
  0% { transform: translateY(0); opacity: 0.05; }
  100% { transform: translateY(-8rpx); opacity: 0.2; }
}

/* Social: pulsing network */
.geo-bubble {
  position: absolute; border-radius: 50%;
  border: 1.5rpx solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  animation: bubble-breathe 3s ease-in-out infinite alternate;
}
.geo-bubble--1 { width: 90rpx; height: 90rpx; top: 8%; left: 6%; }
.geo-bubble--2 { width: 60rpx; height: 60rpx; top: 50%; right: 10%; }
.geo-bubble--3 { width: 75rpx; height: 75rpx; bottom: 12%; left: 22%; }
.geo-bubble--4 { width: 50rpx; height: 50rpx; top: 15%; right: 30%; animation-delay: 0.8s; }

@keyframes bubble-breathe {
  0% { transform: scale(1); border-color: rgba(255, 255, 255, 0.08); }
  100% { transform: scale(1.1); border-color: rgba(255, 255, 255, 0.18); }
}

.node-dot {
  position: absolute;
  width: 7rpx; height: 7rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: node-pulse 2s ease-in-out infinite alternate;
}
@keyframes node-pulse {
  0% { box-shadow: 0 0 2rpx rgba(255,255,255,0.2); transform: scale(1); }
  100% { box-shadow: 0 0 10rpx 3rpx rgba(255,255,255,0.35); transform: scale(1.3); }
}

.node-line {
  position: absolute; height: 1rpx;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transform-origin: left center;
}
.node-line--1 { top: 26%; left: 12%; width: 130rpx; transform: rotate(28deg); }
.node-line--2 { top: 48%; left: 28%; width: 110rpx; transform: rotate(-18deg); }
.node-line--3 { top: 62%; left: 10%; width: 140rpx; transform: rotate(35deg); }
.node-line--4 { top: 35%; left: 35%; width: 100rpx; transform: rotate(-45deg); }

/* Rest: surreal dreamscape */
.geo-wave {
  position: absolute; left: 0; right: 0; height: 2rpx;
  background: linear-gradient(90deg,
    transparent 0%, rgba(255,255,255,0.06) 20%,
    rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 80%, transparent 100%
  );
  border-radius: 50%;
}
.geo-wave--1 { top: 22%; animation: wave-drift 5s ease-in-out infinite; }
.geo-wave--2 { top: 42%; animation: wave-drift 6s ease-in-out infinite reverse; }
.geo-wave--3 { top: 62%; animation: wave-drift 7s ease-in-out infinite 1s; }
@keyframes wave-drift {
  0%, 100% { transform: translateY(0) scaleX(1); }
  50% { transform: translateY(8rpx) scaleX(0.9); }
}

.geo-oval {
  position: absolute; border-radius: 50%;
  border: 1rpx solid rgba(255,255,255,0.06);
  left: 50%; transform: translateX(-50%);
}
.geo-oval--1 { width: 240rpx; height: 110rpx; top: 8%; }
.geo-oval--2 { width: 180rpx; height: 85rpx; bottom: 18%; }
.geo-oval--3 { width: 200rpx; height: 95rpx; top: 45%; opacity: 0.5; animation: oval-sway 8s ease-in-out infinite; }

@keyframes oval-sway {
  0%, 100% { transform: translateX(-50%) rotate(0deg); }
  50% { transform: translateX(-50%) rotate(3deg); }
}

.geo-spiral {
  position: absolute; left: 50%; top: 50%;
  width: 100rpx; height: 100rpx;
  border-radius: 50%;
  border: 1rpx solid rgba(255,255,255,0.05);
  transform: translate(-50%, -50%);
  animation: spiral-spin 20s linear infinite;
  box-shadow:
    0 0 0 16rpx rgba(255,255,255,0.02),
    0 0 0 32rpx rgba(255,255,255,0.01);
}
@keyframes spiral-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.zen-particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: zen-rise 5s ease-in-out infinite;
}
@keyframes zen-rise {
  0%, 100% { transform: translateY(0); opacity: 0.05; }
  50% { transform: translateY(-18rpx); opacity: 0.45; }
}

/* ── Emoji stage ── */
.emoji-stage {
  position: absolute; inset: 0; z-index: 2;
  display: flex; align-items: center; justify-content: center;
}
.emoji-glow {
  position: absolute;
  width: 100rpx; height: 100rpx;
  border-radius: 50%;
  animation: glow-breathe 2.5s ease-in-out infinite alternate;
}
@keyframes glow-breathe {
  0% { transform: scale(0.9); opacity: 0.7; }
  100% { transform: scale(1.1); opacity: 1; }
}
.emoji-aura {
  position: absolute;
  width: 140rpx; height: 140rpx;
  border-radius: 50%;
  animation: aura-pulse 3s ease-in-out infinite alternate;
}
@keyframes aura-pulse {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.15); opacity: 1; }
}
.portrait-emoji {
  font-size: 80rpx;
  position: relative;
  z-index: 3;
  filter: drop-shadow(0 0 10rpx rgba(0,0,0,0.5));
  animation: emoji-float 4s ease-in-out infinite alternate;
}
@keyframes emoji-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6rpx); }
}

/* ── Vignette ── */
.vignette {
  position: absolute; inset: 0; z-index: 3; pointer-events: none;
  border-radius: 36rpx;
  box-shadow: inset 0 0 50rpx 14rpx rgba(0,0,0,0.35);
}
</style>
