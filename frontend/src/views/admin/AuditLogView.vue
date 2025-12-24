<script setup>
import { ref, onMounted } from 'vue';
import adminService from '../../services/adminService';
import { showError } from '../../utils/alert';

const logs = ref([]);
const loading = ref(false);

const fetchLogs = async () => {
  loading.value = true;
  try {
    const response = await adminService.getAuditLogs();
    logs.value = response.data.data;
  } catch (err) {
    showError("Failed to load audit logs");
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const getActionClass = (action) => {
  switch (action) {
    case 'CREATE': return 'bg-green-100 text-green-700';
    case 'UPDATE': return 'bg-blue-100 text-blue-700';
    case 'DELETE': return 'bg-red-100 text-red-700';
    case 'RESTORE': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

onMounted(fetchLogs);
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-slate-800">System Activity Audit</h1>
      <button @click="fetchLogs" class="text-sm bg-white border px-3 py-2 rounded shadow-sm hover:bg-gray-50">
        Refresh Logs
      </button>
    </div>

    

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Timestamp</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Action</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Target Entity</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Changes</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="log in logs" :key="log._id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(log.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="font-medium text-gray-900">{{ log.performedBy?.name || 'System' }}</span>
              <div class="text-xs text-gray-500">{{ log.performedBy?.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span :class="getActionClass(log.action)" class="px-2 py-1 rounded-full text-xs font-bold">
                {{ log.action }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <span class="font-bold text-slate-700">{{ log.entityType }}</span>
              <div class="text-[10px] text-gray-400 font-mono">{{ log.entityId }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <div v-if="log.action === 'UPDATE'" class="max-w-xs truncate">
                Modified: {{ Object.keys(log.newValue || {}).join(', ') }}
              </div>
              <div v-else-if="log.action === 'DELETE'" class="text-red-500 italic">
                Item moved to trash
              </div>
              <div v-else>
                No additional details
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="logs.length === 0 && !loading" class="p-10 text-center text-gray-400 italic">
        No activity recorded yet.
      </div>
    </div>
  </div>
</template>