<script setup>
import { ref, onMounted } from "vue";
import adminService from "../../services/adminService";
import { showError } from "../../utils/alert";

const logs = ref([]);
const loading = ref(false);

const fetchLogs = async () => {
  loading.value = true;
  try {
    const response = await adminService.getAuditLogs();
    logs.value = response.data.data;
  } catch (err) {
    console.log(err);
    showError("Failed to load logs");
  } finally {
    loading.value = false;
  }
};

// Helper to color code actions
const getActionColor = (action) => {
  const map = {
    CREATE: "bg-green-100 text-green-800",
    UPDATE: "bg-blue-100 text-blue-800",
    DELETE: "bg-red-100 text-red-800",
    LOGIN: "bg-purple-100 text-purple-800",
  };
  return map[action] || "bg-gray-100 text-gray-800";
};

const formatDate = (date) => new Date(date).toLocaleString();

onMounted(fetchLogs);
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">System Activity Logs</h1>
      <button
        @click="fetchLogs"
        class="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50 text-sm"
      >
        Refresh
      </button>
    </div>

    <div v-if="loading" class="text-center py-10 text-gray-500">
      Loading activity...
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase"
            >
              Time
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase"
            >
              Action
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase"
            >
              User
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase"
            >
              Entity
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase"
            >
              Details
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="log in logs" :key="log._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
              {{ formatDate(log.createdAt) }}
            </td>
            <td class="px-6 py-4 text-sm">
              <span
                :class="getActionColor(log.action)"
                class="px-2 py-1 rounded-full text-xs font-bold"
              >
                {{ log.action }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 font-medium">
              {{ log.performedBy?.name || "Unknown" }}
              <div class="text-xs text-gray-500 font-normal">
                {{ log.performedBy?.email }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ log.entityType }}
              <div class="text-xs text-gray-400 font-mono">
                {{ log.entityId }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
              <div v-if="log.action === 'DELETE'">
                <span class="text-red-600">Marked Inactive</span>
              </div>
              <div v-if="log.oldValue?.isActive !== undefined">
                Active: {{ log.oldValue.isActive }} →
                {{ log.newValue.isActive }}
              </div>
            </td>
          </tr>
          <tr v-if="logs.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-gray-400">
              No logs found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
