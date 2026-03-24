import { ref, computed, watch } from 'vue'
import { MOCK_TABLE_DATA } from '@/constants/wms.js'

export function useTable() {
  const tableData = ref([...MOCK_TABLE_DATA])
  const loading = ref(false)
  const searchQuery = ref('')
  const searchCategory = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)

  const filteredTableData = computed(() => {
    return tableData.value.filter((item) => {
      const matchQuery =
        !searchQuery.value ||
        item.name.includes(searchQuery.value) ||
        item.sku.includes(searchQuery.value)
      const matchCategory = !searchCategory.value || item.category === searchCategory.value
      return matchQuery && matchCategory
    })
  })

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredTableData.value.slice(start, start + pageSize.value)
  })

  const handlePageChange = (page) => {
    currentPage.value = page
  }

  const resetSearch = () => {
    searchQuery.value = ''
    searchCategory.value = ''
  }

  const addItem = (item) => {
    const maxId = tableData.value.length > 0 ? Math.max(...tableData.value.map((p) => p.id)) : 0
    tableData.value.push({
      ...item,
      id: maxId + 1,
      price: Number(item.price),
      image: 'https://via.placeholder.com/40',
    })
  }

  const updateItem = (item) => {
    const index = tableData.value.findIndex((p) => p.id === item.id)
    if (index !== -1) {
      tableData.value[index] = {
        ...item,
        price: Number(item.price),
        image: tableData.value[index].image || 'https://via.placeholder.com/40',
      }
    }
  }

  const deleteItem = (row) => {
    tableData.value = tableData.value.filter((item) => item.id !== row.id)
  }

  watch([searchQuery, searchCategory], () => {
    currentPage.value = 1
  })

  return {
    tableData,
    loading,
    searchQuery,
    searchCategory,
    currentPage,
    pageSize,
    filteredTableData,
    paginatedData,
    handlePageChange,
    resetSearch,
    addItem,
    updateItem,
    deleteItem,
  }
}