<template>
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? '新增物资' : '编辑物资'"
    width="560px"
    destroy-on-close
    @close="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="物资名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入物资名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物资编码" prop="code">
            <el-input v-model="form.code" placeholder="如：GOODS-001" :disabled="type === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%">
              <el-option
                v-for="opt in categoryOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" placeholder="如：台、个、包" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="规格" prop="specification">
            <el-input v-model="form.specification" placeholder="如：15.6寸/16GB/512GB" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单价(元)" prop="price">
            <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警下限" prop="min_stock">
            <el-input-number v-model="form.min_stock" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警上限" prop="max_stock">
            <el-input-number v-model="form.max_stock" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addGoods, updateGoods } from '@/api/goods.js'

const props = defineProps({
  type: { type: String, default: 'add' },
  rowData: { type: Object, default: null },
  categoryOptions: { type: Array, default: () => [] },
})

const emit = defineEmits(['saved'])
const visible = defineModel('visible', { default: false })

const formRef = ref(null)
const saving = ref(false)

const defaultForm = () => ({
  name: '', code: '', category_id: '', specification: '',
  unit: '', price: 0, min_stock: 0, max_stock: 99999, status: 1,
})

const form = reactive(defaultForm())

const rules = {
  name:        [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
  code:        [{ required: true, message: '请输入物资编码', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择分类',   trigger: 'change' }],
  unit:        [{ required: true, message: '请输入单位',   trigger: 'blur' }],
}

watch(
  () => props.rowData,
  (row) => {
    if (row) {
      Object.assign(form, { ...defaultForm(), ...row })
    } else {
      Object.assign(form, defaultForm())
    }
  },
  { immediate: true },
)

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, defaultForm())
}

const handleSave = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (props.type === 'add') {
      await addGoods({ ...form })
      ElMessage.success('新增成功')
    } else {
      await updateGoods({ ...form, id: props.rowData.id })
      ElMessage.success('编辑成功')
    }
    visible.value = false
    emit('saved')
  } catch (err) {
    ElMessage.error(err.message || '操作失败')
  } finally {
    saving.value = false
  }
}
</script>
