/**
 * goodsStore.js — 物资管理状态
 * 管理物资列表缓存、分类列表缓存、搜索/筛选/分页状态
 */
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getGoodsList, createGoods, updateGoods, deleteGoods } from '../api/goods'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/category'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/wms'

export const useGoodsStore = defineStore('goods', () => {
  // ── 物资列表 ──────────────────────────────────────────────────────
  const goodsList = ref([])
  const goodsTotal = ref(0)
  const goodsLoading = ref(false)

  // ── 分类列表 ──────────────────────────────────────────────────────
  const categories = ref([])
  const categoriesLoading = ref(false)

  // ── 搜索与分页状态 ────────────────────────────────────────────────
  const query = reactive({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    keyword: '',
    categoryId: '',
  })

  // ── 物资方法 ──────────────────────────────────────────────────────

  /** 获取物资列表 */
  const fetchGoodsList = async (params) => {
    goodsLoading.value = true
    try {
      const data = await getGoodsList({ ...query, ...params })
      goodsList.value = data?.list || data?.records || []
      goodsTotal.value = data?.total || 0
      return data
    } finally {
      goodsLoading.value = false
    }
  }

  /** 新增物资 */
  const addGoods = async (formData) => {
    await createGoods(formData)
    await fetchGoodsList()
  }

  /** 修改物资 */
  const editGoods = async (id, formData) => {
    await updateGoods(id, formData)
    await fetchGoodsList()
  }

  /** 删除物资 */
  const removeGoods = async (id) => {
    await deleteGoods(id)
    await fetchGoodsList()
  }

  /** 重置搜索条件并重新加载 */
  const resetQuery = () => {
    query.page = DEFAULT_PAGE
    query.pageSize = DEFAULT_PAGE_SIZE
    query.keyword = ''
    query.categoryId = ''
  }

  // ── 分类方法 ──────────────────────────────────────────────────────

  /** 获取分类列表 */
  const fetchCategories = async () => {
    categoriesLoading.value = true
    try {
      const data = await getCategories()
      categories.value = Array.isArray(data) ? data : (data?.list || [])
      return categories.value
    } finally {
      categoriesLoading.value = false
    }
  }

  /** 新增分类 */
  const addCategory = async (formData) => {
    await createCategory(formData)
    await fetchCategories()
  }

  /** 修改分类 */
  const editCategory = async (id, formData) => {
    await updateCategory(id, formData)
    await fetchCategories()
  }

  /** 删除分类 */
  const removeCategory = async (id) => {
    await deleteCategory(id)
    await fetchCategories()
  }

  return {
    goodsList,
    goodsTotal,
    goodsLoading,
    categories,
    categoriesLoading,
    query,
    fetchGoodsList,
    addGoods,
    editGoods,
    removeGoods,
    resetQuery,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  }
})
