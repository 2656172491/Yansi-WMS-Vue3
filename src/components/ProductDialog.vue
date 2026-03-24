<template>
  <el-dialog :model-value="visible" :title="title" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="localForm" :rules="productRules" label-width="80px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="localForm.name" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="SKU编号" prop="sku">
        <el-input v-model="localForm.sku" placeholder="例如: SKU-001" />
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-select v-model="localForm.category" placeholder="请选择" class="w-full">
          <el-option
            v-for="cat in categories"
            :key="cat.value"
            :label="cat.label"
            :value="cat.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="初始库存" prop="stock">
        <el-input-number v-model="localForm.stock" :min="0" />
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="localForm.price" placeholder="0.00">
          <template #prefix>¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="localForm.status" active-text="上架" inactive-text="下架" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CATEGORIES } from '@/constants/wms.js'
import { productRules } from '@/utils/validators.js'

const props = defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, default: '' },
  formData: { type: Object, required: true },
  saving: { type: Boolean, default: false },
  categories: { type: Array, default: () => CATEGORIES },
})

const emit = defineEmits(['update:visible', 'save'])

const formRef = ref(null)
const localForm = ref({ ...props.formData })

// 每次打开对话框时同步最新数据
watch(
  () => props.visible,
  (val) => {
    if (val) {
      localForm.value = { ...props.formData }
      formRef.value?.clearValidate()
    }
  },
)

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = async () => {
  try {
    await formRef.value.validate()
    emit('save', { ...localForm.value })
  } catch {
    // 验证未通过，保持对话框打开
  }
}
</script>
