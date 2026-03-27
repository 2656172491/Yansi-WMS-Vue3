<!-- 确认操作按钮组件 — 执行危险操作前弹出确认框 -->
<!-- 用法示例：
  <ConfirmButton :message="`确认删除用户【${row.realName}】吗？`" @confirm="handleDelete(row)">
    删除
  </ConfirmButton>
-->
<template>
  <el-popconfirm
    :title="message"
    :confirm-button-text="confirmText"
    :cancel-button-text="cancelText"
    :icon="WarningFilled"
    icon-color="#f56c6c"
    @confirm="$emit('confirm')"
  >
    <template #reference>
      <el-button :type="type" :size="size" :icon="icon" link>
        <slot>删除</slot>
      </el-button>
    </template>
  </el-popconfirm>
</template>

<script setup>
import { WarningFilled } from '@element-plus/icons-vue'

defineProps({
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
  /** 按钮类型（Element Plus button type） */
  type: {
    type: String,
    default: 'danger',
  },
  /** 按钮尺寸 */
  size: {
    type: String,
    default: 'default',
  },
  /** 按钮图标组件（可选） */
  icon: {
    type: [Object, Function, String],
    default: undefined,
  },
})

defineEmits(['confirm'])
</script>
