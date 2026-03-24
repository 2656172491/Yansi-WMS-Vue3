import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const defaultForm = () => ({
  name: '',
  sku: '',
  category: '',
  stock: 0,
  price: '',
  status: true,
})

export function useProductForm() {
  const dialogVisible = ref(false)
  const dialogType = ref('add')
  const saving = ref(false)
  const formData = ref(defaultForm())

  const dialogTitle = computed(() => (dialogType.value === 'add' ? '新增商品' : '编辑商品'))

  const openDialog = (type, row) => {
    dialogType.value = type
    formData.value = type === 'edit' && row ? { ...row } : defaultForm()
    dialogVisible.value = true
  }

  const closeDialog = () => {
    dialogVisible.value = false
  }

  /**
   * 保存表单数据
   * @param {Object} data - 已验证的表单数据
   * @param {Function} onAdd - 新增时的回调，接收表单数据
   * @param {Function} onUpdate - 编辑时的回调，接收表单数据
   */
  const saveData = async (data, onAdd, onUpdate) => {
    saving.value = true
    try {
      if (dialogType.value === 'add') {
        await onAdd({ ...data })
        ElMessage.success('新增成功')
      } else {
        await onUpdate({ ...data })
        ElMessage.success('编辑成功')
      }
      dialogVisible.value = false
    } catch (err) {
      ElMessage.error(`操作失败：${err?.message || '未知错误'}`)
    } finally {
      saving.value = false
    }
  }

  return {
    dialogVisible,
    dialogType,
    saving,
    formData,
    dialogTitle,
    openDialog,
    closeDialog,
    saveData,
  }
}
