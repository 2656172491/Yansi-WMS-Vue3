/**
 * useGoods.js — 物资管理 composable
 */
import { ElMessage, ElMessageBox } from 'element-plus'
import { useGoodsStore } from '../stores/goodsStore'

export function useGoods() {
  const goodsStore = useGoodsStore()

  /** 加载物资列表 */
  const loadGoods = (params) => goodsStore.fetchGoodsList(params)

  /** 加载分类列表 */
  const loadCategories = () => goodsStore.fetchCategories()

  /**
   * 新增物资
   * @param {Object} formData
   */
  const addGoods = async (formData) => {
    await goodsStore.addGoods(formData)
    ElMessage.success('新增物资成功')
  }

  /**
   * 修改物资
   * @param {number|string} id
   * @param {Object} formData
   */
  const editGoods = async (id, formData) => {
    await goodsStore.editGoods(id, formData)
    ElMessage.success('修改物资成功')
  }

  /**
   * 删除物资（带二次确认）
   * @param {number|string} id
   * @param {string} [name] - 物资名称，用于确认提示
   */
  const removeGoods = async (id, name) => {
    await ElMessageBox.confirm(
      `确定要删除物资"${name || id}"吗？`,
      '提示',
      { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }
    )
    await goodsStore.removeGoods(id)
    ElMessage.success('删除成功')
  }

  /**
   * 新增分类
   * @param {Object} formData
   */
  const addCategory = async (formData) => {
    await goodsStore.addCategory(formData)
    ElMessage.success('新增分类成功')
  }

  /**
   * 修改分类
   * @param {number|string} id
   * @param {Object} formData
   */
  const editCategory = async (id, formData) => {
    await goodsStore.editCategory(id, formData)
    ElMessage.success('修改分类成功')
  }

  /**
   * 删除分类（带二次确认）
   * @param {number|string} id
   * @param {string} [name]
   */
  const removeCategory = async (id, name) => {
    await ElMessageBox.confirm(
      `确定要删除分类"${name || id}"吗？`,
      '提示',
      { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }
    )
    await goodsStore.removeCategory(id)
    ElMessage.success('删除成功')
  }

  return {
    goodsList: goodsStore.goodsList,
    goodsTotal: goodsStore.goodsTotal,
    goodsLoading: goodsStore.goodsLoading,
    categories: goodsStore.categories,
    query: goodsStore.query,
    loadGoods,
    loadCategories,
    addGoods,
    editGoods,
    removeGoods,
    addCategory,
    editCategory,
    removeCategory,
    resetQuery: goodsStore.resetQuery,
  }
}
