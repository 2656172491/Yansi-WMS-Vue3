<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span class="font-bold text-gray-700">物资出库</span>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 520px">
        <el-form-item label="物资" prop="goods_id">
          <el-select
            v-model="form.goods_id"
            placeholder="请选择物资"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in inventoryList"
              :key="item.goods_id"
              :label="`${item.goods_name}（当前库存：${item.quantity}）`"
              :value="item.goods_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出库数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" :max="currentStock" style="width: 200px" />
          <span v-if="currentStock !== null" class="ml-2 text-gray-400 text-sm">
            当前库存：{{ currentStock }}
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="可选备注信息" />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" :loading="submitting" @click="handleSubmit">确认出库</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 出库记录 -->
    <el-card shadow="never" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold text-gray-700">出库记录</span>
          <el-button size="small" :icon="Refresh" @click="loadRecords">刷新</el-button>
        </div>
      </template>

      <el-table :data="records" v-loading="recordLoading" border stripe style="width: 100%">
        <el-table-column prop="goods_name"       label="物资名称"   min-width="130" />
        <el-table-column prop="quantity"         label="出库数量"   width="100" />
        <el-table-column prop="before_quantity"  label="变动前库存" width="110" />
        <el-table-column prop="after_quantity"   label="变动后库存" width="110" />
        <el-table-column prop="operator"         label="操作人"     width="90"  />
        <el-table-column prop="remark"           label="备注"       min-width="130" show-overflow-tooltip />
        <el-table-column prop="create_time"      label="出库时间"   width="165" />
      </el-table>

      <Pagination
        v-model:current-page="recordPage"
        v-model:page-size="recordPageSize"
        :total="recordTotal"
        @page-change="loadRecords"
        @size-change="loadRecords"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getInventoryAll, outbound, getRecordList } from '@/api/inventory.js'
import Pagination from '@/components/Pagination.vue'

const formRef = ref(null)
const submitting = ref(false)
const inventoryList = ref([])

const form = reactive({ goods_id: '', quantity: 1, remark: '' })
const rules = {
  goods_id: [{ required: true, message: '请选择物资', trigger: 'change' }],
  quantity:  [{ required: true, message: '请输入出库数量', trigger: 'blur' }],
}

const currentStock = computed(() => {
  if (!form.goods_id) return null
  return inventoryList.value.find((i) => i.goods_id === form.goods_id)?.quantity ?? null
})

const loadInventory = async () => {
  const res = await getInventoryAll()
  inventoryList.value = res.data
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await outbound({ ...form })
    ElMessage.success('出库成功')
    resetForm()
    loadInventory()
    loadRecords()
  } catch (err) {
    ElMessage.error(err.message || '出库失败')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, { goods_id: '', quantity: 1, remark: '' })
}

// 出库记录
const records = ref([])
const recordLoading = ref(false)
const recordPage = ref(1)
const recordPageSize = ref(10)
const recordTotal = ref(0)

const loadRecords = async () => {
  recordLoading.value = true
  try {
    const res = await getRecordList({ type: 2, page: recordPage.value, pageSize: recordPageSize.value })
    records.value = res.data.records
    recordTotal.value = res.data.total
  } finally {
    recordLoading.value = false
  }
}

onMounted(() => {
  loadInventory()
  loadRecords()
})
</script>
