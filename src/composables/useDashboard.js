import { ref } from 'vue'
import { STAT_CARDS_CONFIG, MOCK_ALERTS } from '@/constants/wms.js'

export function useDashboard() {
  const statCards = ref([...STAT_CARDS_CONFIG])
  const alerts = ref([...MOCK_ALERTS])
  const chartPeriod = ref('week')

  return { statCards, alerts, chartPeriod }
}