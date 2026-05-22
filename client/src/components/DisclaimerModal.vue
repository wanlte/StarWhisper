<template>
  <view v-if="visible" class="modal-overlay" @click="$emit('close')">
    <view class="modal-card" @click.stop>
      <text class="modal-title">📜 免责声明</text>
      <view class="modal-body">
        <text class="modal-text">
          星语小馆是一款纯娱乐性质的星座趣味小程序。所有星座解读、角色匹配、配对分析等内容仅供参考娱乐，不构成任何形式的指导建议。

          我们严格遵守微信小程序运营规范，绝不涉及算命、吉凶、祸福、改运等违规内容。

          愿你在星语小馆找到一份温暖和乐趣 ✨
        </text>
      </view>
      <view class="modal-footer">
        <view class="btn btn-primary modal-btn" @click="$emit('agree')">
          我知道了
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({ visible: Boolean });
defineEmits(['close', 'agree']);
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.7);
}
.modal-card {
  width: 600rpx; padding: 48rpx 40rpx;
  background: linear-gradient(160deg, #1a1a2e, #16213e);
  border-radius: 24rpx;
  border: 1rpx solid rgba(212, 165, 116, 0.3);
}
.modal-title {
  display: block; text-align: center;
  font-size: 36rpx; font-weight: bold; margin-bottom: 32rpx;
}
.modal-body { margin-bottom: 36rpx; }
.modal-text {
  font-size: 28rpx; color: #B0B0C0; line-height: 1.8;
  white-space: pre-wrap;
}
.modal-footer { display: flex; justify-content: center; }
.modal-btn {
  padding: 20rpx 80rpx; font-size: 30rpx;
}
</style>
