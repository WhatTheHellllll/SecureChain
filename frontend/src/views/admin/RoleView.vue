<script setup>
import { ref, onMounted } from 'vue';
import roleService from '../../services/roleService.js';
import { showSuccess, showError, confirmDelete } from '../../utils/alert.js';

// STATE
const roles = ref([]);
const selectedRole = ref(null);
const loading = ref(false);
const isEditing = ref(false);
const permissionGroups = ref({});
// FETCH DATA
const fetchRoles = async () => {
  try {
    loading.value = true;

    // 1. Fetch Roles
    const roleRes = await roleService.getRoles();
    roles.value = roleRes.data.data;

    // 2. Fetch Permissions
    const permRes = await roleService.getPermissions();
    const rawData = permRes.data.data;

    if (rawData) {
      const cleanData = {};
      for (const groupName in rawData) {
        // Flatten the object values into a simple array
        cleanData[groupName] = Object.values(rawData[groupName]);
      }
      permissionGroups.value = cleanData;
    }

  } catch (err) {
    console.error(err);
    showError('Failed to load data');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRoles);

// --- SELECTION LOGIC ---

const selectRole = (role) => {
  // Deep copy to detach from the list
  selectedRole.value = JSON.parse(JSON.stringify(role));

  // SAFETY: Ensure permissions is a FLAT array (fixes the nested array bug if DB is dirty)
  if (Array.isArray(selectedRole.value.permissions)) {
    selectedRole.value.permissions = selectedRole.value.permissions.flat();
  }

  isEditing.value = true;
};

const initNewRole = () => {
  selectedRole.value = { name: '', description: '', permissions: [] };
  isEditing.value = false;
};

// --- CHECKBOX LOGIC ---

const hasPermission = (perm) => {
  return selectedRole.value?.permissions.includes(perm);
};

const togglePermission = (perm) => {
  if (!selectedRole.value) return;

  const perms = selectedRole.value.permissions;
  if (perms.includes(perm)) {
    selectedRole.value.permissions = perms.filter(p => p !== perm);
  } else {
    selectedRole.value.permissions.push(perm);
  }
};

const toggleGroup = (groupKey) => {
  if (!selectedRole.value) return;

  const groupPerms = permissionGroups.value[groupKey];
  const allSelected = groupPerms.every(p => selectedRole.value.permissions.includes(p));

  if (allSelected) {
    selectedRole.value.permissions = selectedRole.value.permissions.filter(p => !groupPerms.includes(p));
  } else {
    // Add only the ones we don't have yet
    const missing = groupPerms.filter(p => !selectedRole.value.permissions.includes(p));
    selectedRole.value.permissions.push(...missing);
  }
};

const isGroupSelected = (groupKey) => {
  if (!selectedRole.value) return false;
  return permissionGroups.value[groupKey]?.every(p => selectedRole.value.permissions.includes(p));
};

// --- SAVE LOGIC ---

const handleSave = async () => {
  if (!selectedRole.value.name) return showError("Role Name is required");

  loading.value = true;
  try {
    // FINAL SAFETY: Flatten array before sending
    const dataToSend = {
      ...selectedRole.value,
      permissions: selectedRole.value.permissions.flat()
    };

    if (isEditing.value) {
      await roleService.updateRole(dataToSend._id, dataToSend);
      showSuccess("Role updated successfully");
    } else {
      await roleService.createRole(dataToSend);
      showSuccess("Role created successfully");
    }

    // Refresh the list to see changes
    await fetchRoles();
    selectedRole.value = null;
  } catch (err) {
    showError(err.response?.data?.error || "Save failed");
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  try {
    if (await confirmDelete()) {
      await roleService.deleteRole(selectedRole.value._id);
      showSuccess("Role deleted");
      selectedRole.value = null;
      fetchRoles();
    }
  } catch (err) {
    showError(err.response?.data?.error);
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-gray-100 p-4 md:p-6 gap-4 md:gap-6 overflow-hidden">

    <div class="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 flex flex-col h-1/3 md:h-full">
      <div class="flex justify-between items-center mb-4 flex-none">
        <h2 class="text-lg md:text-xl font-bold text-slate-800">Roles</h2>
        <button @click="initNewRole"
          class="text-xs md:text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
          + New
        </button>
      </div>

      <div class="space-y-2 overflow-y-auto flex-grow custom-scrollbar pr-1">
        <div v-for="role in roles" :key="role._id" @click="selectRole(role)"
          class="p-3 rounded-lg cursor-pointer transition border border-transparent hover:border-gray-300 hover:bg-gray-50"
          :class="{ 'bg-blue-50 border-blue-200 ring-1 ring-blue-300': selectedRole?._id === role._id }">
          <div class="font-bold text-gray-800 text-sm md:text-base">{{ role.name }}</div>
          <div class="text-xs text-gray-500 truncate">{{ role.description || 'No description' }}</div>
        </div>
      </div>
    </div>

    <div class="w-full md:w-3/4 bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col h-2/3 md:h-full"
      v-if="selectedRole">

      <div class="flex flex-col md:flex-row gap-4 mb-4 border-b pb-4 flex-none">
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-500 uppercase">Role Name</label>
          <input v-model="selectedRole.name" type="text" class="w-full mt-1 p-2 border rounded font-bold text-lg"
            placeholder="e.g. Manager" />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-500 uppercase">Description</label>
          <input v-model="selectedRole.description" type="text" class="w-full mt-1 p-2 border rounded"
            placeholder="What can this role do?" />
        </div>
      </div>

      <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        <div v-for="(perms, groupName) in permissionGroups" :key="groupName" class="mb-6">

          <div class="flex items-center justify-between mb-2 bg-gray-50 p-2 rounded sticky top-0 z-10">
            <h3 class="font-bold text-sm md:text-base text-slate-700">{{ groupName }}</h3>
            <button @click="toggleGroup(groupName)" class="text-xs font-bold px-2 py-1 rounded transition"
              :class="isGroupSelected(groupName) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
              {{ isGroupSelected(groupName) ? 'Uncheck All' : 'Check All' }}
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div v-for="perm in perms" :key="perm" @click="togglePermission(perm)"
              class="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent transition"
              :class="{ 'border-blue-300 bg-blue-50': hasPermission(perm) }">
              <div class="w-4 h-4 md:w-5 md:h-5 rounded border flex-none flex items-center justify-center transition"
                :class="hasPermission(perm) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'">
                <span v-if="hasPermission(perm)" class="text-white text-[10px]">✓</span>
              </div>
              <span class="text-xs md:text-sm text-gray-700 select-none break-all">{{ perm }}</span>
            </div>
          </div>

        </div>
      </div>

      <div class="border-t pt-4 mt-4 flex justify-between items-center flex-none">
        <button v-if="isEditing" @click="handleDelete"
          class="text-red-500 text-sm hover:text-red-700 font-medium">Delete</button>
        <div v-else></div>
        <button @click="handleSave" :disabled="loading"
          class="bg-slate-800 text-white px-6 py-2 rounded-lg text-sm hover:bg-slate-900 disabled:bg-gray-400">
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </div>

    </div>

    <div v-else
      class="w-full md:w-3/4 flex items-center justify-center text-gray-400 bg-white rounded-lg shadow-md h-2/3 md:h-full">
      Select a role to edit
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>