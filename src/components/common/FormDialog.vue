<!-- 表单弹窗组件 — 统一的新增/编辑对话框包装 -->
<!-- 用法示例：
  <FormDialog v-model="dialogVisible" :title="dialogTitle" @confirm="handleSave">
    <el-form :model="formData" label-width="90px">
      <el-form-item label="用户名">
        <el-input v-model="formData.username" />
      </el-form-item>
    </el-form>
  </FormDialog>
-->
<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="$emit('cancel')"
  >
    <!-- 表单内容插槽 -->
    <slot />

    <template #footer>
      <slot name="footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="$emit('confirm')">
          {{ confirmText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
defineProps({
  /** 控制弹窗显隐（v-model） */
  modelValue: {
    type: Boolean,
    required: true,
  },
  /** 弹窗标题 */
  title: {
    type: String,
    default: '',
  },
  /** 弹窗宽度，默认使用中等预设 */
  width: {
    type: String,
    default: 'var(--dialog-width-md, 560px)',
  },
  /** 确认按钮文字 */
  confirmText: {
    type: String,
    default: '保存',
  },
  /** 确认按钮 loading 状态 */
  confirmLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>
