<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-bold">{{ isEdit ? '编辑物资' : '新增物资' }}</span>
          <el-button @click="router.push('/goods/list')">返回列表</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="productRules"
        label-width="100px"
        style="max-width: 600px"
      >
        <el-form-item label="物资名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入物资名称" />
        </el-form-item>
        <el-form-item label="SKU编号" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入SKU编号" />
        </el-form-item>
        <el-form-item label="物资分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="item in CATEGORIES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" type="number" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="初始库存" prop="stock">
          <el-input v-model.number="form.stock" type="number" placeholder="请输入初始库存" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" active-text="上架" inactive-text="下架" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
          <el-button @click="router.push('/goods/list')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { productRules } from '@/utils/validators.js'
import { CATEGORIES } from '@/constants/wms.js'
import { createGoods, updateGoods } from '@/api/goods.js'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const formRef = ref(null)

const form = ref({
  name: '',
  sku: '',
  category: '',
  price: '',
  stock: 0,
  status: true,
})

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      if (isEdit.value) {
        await updateGoods(route.params.id, form.value)
      } else {
        await createGoods(form.value)
      }
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      router.push('/goods/list')
    } catch {
      ElMessage.error('操作失败，请稍后重试')
    } finally {
      saving.value = false
    }
  })
}
</script>
