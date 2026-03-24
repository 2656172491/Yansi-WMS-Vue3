import { ref } from 'vue';

export function useTable(data) {
    const tableData = ref(data);
    const searchQuery = ref('');
    const filteredData = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // Search Functionality
    function search() {
        filteredData.value = tableData.value.filter(item => {
            return Object.values(item).some(value => 
                value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });
    }

    // Pagination Functionality
    function paginate() {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return filteredData.value.slice(start, end);
    }

    // Add Data Functionality
    function addItem(item) {
        tableData.value.push(item);
        search();  // reapply search to update filtered data
    }

    // Update Data Functionality
    function updateItem(index, item) {
        tableData.value[index] = item;
        search();  // reapply search to update filtered data
    }

    // Delete Data Functionality
    function deleteItem(index) {
        tableData.value.splice(index, 1);
        search();  // reapply search to update filtered data
    }

    // Watch for changes in search query and filter the data
    watch(searchQuery, search);

    return {
        tableData,
        searchQuery,
        filteredData,
        currentPage,
        itemsPerPage,
        paginate,
        addItem,
        updateItem,
        deleteItem,
    };
}