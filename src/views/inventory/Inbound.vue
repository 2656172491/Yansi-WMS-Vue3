<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span class="font-bold text-gray-700">物资入库</span>
      </template>

      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          style="max-width: 520px"
      >
        <el-form-item label="物资" prop="id">
          <el-select
              v-model="form.id"
              placeholder="请选择物资"
              filterable
              style="width: 100%"
              :loading="goodsLoading"
          >
            <el-option
                v-for="item in GoodsList"
                :key="item.id"
                :label="`${item.name || ''}（当前库存：${item.quantity ?? 0}）`"
                :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="入库数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" style="width: 200px" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="可选备注信息"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            确认入库
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 入库记录 -->
    <el-card shadow="never" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold text-gray-700">入库记录</span>
          <el-button size="small" :icon="Refresh" @click="loadRecords">刷新</el-button>
        </div>
      </template>

      <el-table
          :data="records"
          v-loading="recordLoading"
          border
          stripe
          style="width: 100%"
      >
        <el-table-column prop="name" label="物资名称" min-width="130">
          <template #default="{ row }">
            {{ row.name || '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="入库数量" width="100" />
        <el-table-column prop="beforeQuantity" label="变动前库存" width="110" />
        <el-table-column prop="afterQuantity" label="变动后库存" width="110" />
        <el-table-column prop="operatorName" label="操作人" width="90" />

        <el-table-column prop="remark" label="备注" min-width="130" show-overflow-tooltip />

        <el-table-column prop="createTime" label="入库时间" width="165" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getRecordList } from '@/api/inventory.js'
import Pagination from '@/components/Pagination.vue'
import { getGoodById, getGoodsList, getQuantityById, updateGoods } from '@/api/api.js'

const formRef = ref(null)
const submitting = ref(false)

const GoodsList = ref([])
const goodsLoading = ref(false)

const form = reactive({
  id: '',
  quantity: 1,
  remark: ''
})

// 规则
const rules = {
  id: [{ required: true, message: '请选择物资', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入入库数量', trigger: 'blur' }]
}

// 加载物资列表
const loadGoods = async () => {
  goodsLoading.value = true
  try {
    const res = await getGoodsList()
    const rows = res.data.rows || []

    GoodsList.value = await Promise.all(
        rows.map(async (row) => {
          try {
            const qRes = await getQuantityById(row.id)
            return {
              ...row,
              quantity: qRes.data[0]?.quantity || 0
            }
          } catch (err) {
            return {
              ...row,
              quantity: 0
            }
          }
        })
    )
  } catch (err) {
    GoodsList.value = []
    ElMessage.error('加载物资列表失败')
  } finally {
    goodsLoading.value = false
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    await updateGoods({ ...form })
    ElMessage.success('入库成功')
    resetForm()
    await loadGoods()
    await loadRecords()
  } catch (err) {
    ElMessage.error(err.message || '入库失败')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, { id: '', quantity: 1, remark: '', type: '1'})
}

// 入库记录
const records = ref([])
const recordLoading = ref(false)
const recordPage = ref(1)
const recordPageSize = ref(10)
const recordTotal = ref(0)

const getGood = async (id) => {
  const res = await getGoodById(id)
  return res.data?.name || ''
}

const loadRecords = async () => {
  recordLoading.value = true
  try {
    const res = await getRecordList({
      type: 1,
      pageNum: recordPage.value,
      pageSize: recordPageSize.value
    })

    const rows = res.data.rows || []

    records.value = await Promise.all(
        rows.map(async (item) => {
          let name = ''
          try {
            name = await getGood(item.goodsId)
          } catch (err) {
            name = ''
          }
          return {
            ...item,
            name
          }
        })
    )

    recordTotal.value = res.data.total || 0
  } catch (err) {
    records.value = []
    recordTotal.value = 0
    ElMessage.error('加载入库记录失败')
  } finally {
    recordLoading.value = false
  }
}

onMounted(() => {
  loadGoods()
  loadRecords()
})
</script>