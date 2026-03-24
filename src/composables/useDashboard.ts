// Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2026-03-24 03:05:38
// Current User's Login: 2656172491

import { ref } from 'vue';

export function useDashboard() {
    const currentTime = ref(new Date().toISOString());
    const currentUser = ref('2656172491');

    return { currentTime, currentUser };
}