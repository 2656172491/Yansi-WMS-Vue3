<!-- 确认操作按钮组件 — 执行危险操作前弹出确认框 -->
<!-- 用法示例（使用默认删除按钮）：
  <ConfirmButton :message="`确认删除用户【${row.realName}】吗？`" @confirm="handleDelete(row)" />
-->
<!-- 用法示例（自定义触发元素）：
  <ConfirmButton message="确定恢复默认配置吗？" @confirm="doReset">
    <el-button>恢复默认</el-button>
  </ConfirmButton>
-->
<template>
  <span class="confirm-button-wrapper" @click="handleClick" @keydown.enter="handleClick" @keydown.space.prevent="handleClick">
    <slot>
      <el-button :type="type" :size="size" :icon="icon" link>删除</el-button>
    </slot>
  </span>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  /** 弹窗标题 */
  title: {
    type: String,
    default: '提示',
  },
  /** 确认弹窗提示内容 */
  message: {
    type: String,
    default: '确认执行此操作吗？',
  },
  /** 确认按钮文字 */
  confirmText: {
    type: String,
    default: '确认',
  },
  /** 取消按钮文字 */
  cancelText: {
    type: String,
    default: '取消',
  },
  /** 按钮类型（Element Plus button type，仅影响默认 slot 内的按钮） */
  type: {
    type: String,
    default: 'danger',
  },
  /** 按钮尺寸（仅影响默认 slot 内的按钮） */
  size: {
    type: String,
    default: 'default',
  },
  /** 按钮图标组件（可选，仅影响默认 slot 内的按钮） */
  icon: {
    type: [Object, Function, String],
    default: undefined,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const handleClick = () => {
  ElMessageBox.confirm(props.message, props.title, {
    type: 'warning',
    confirmButtonText: props.confirmText,
    cancelButtonText: props.cancelText,
  })
    .then(() => emit('confirm'))
    .catch(() => emit('cancel'))
}
</script>

<style scoped>
.confirm-button-wrapper {
  display: contents;
}
</style>
