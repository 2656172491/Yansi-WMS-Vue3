// useTable.js

import { ref, computed } from 'vue';

export default function useTable(data) {
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const searchQuery = ref('');
    const filteredData = computed(() => {
        return data.filter(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
    });
    const totalPages = computed(() => {
        return Math.ceil(filteredData.value.length / itemsPerPage.value);
    });
    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredData.value.slice(start, start + itemsPerPage.value);
    });

    function nextPage() {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    }

    function prevPage() {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    }

    function setSearchQuery(query) {
        searchQuery.value = query;
        currentPage.value = 1; // Reset to first page on search
    }

    return {
        currentPage,
        itemsPerPage,
        searchQuery,
        paginatedData,
        totalPages,
        nextPage,
        prevPage,
        setSearchQuery
    };
}