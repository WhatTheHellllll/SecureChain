<script setup>
import { ref, onMounted } from "vue";
import roleService from "../../services/roleService.js";
import { showSuccess, showError, confirmDelete } from "../../utils/alert.js";
import PermissionSelector from "../../components/admin/PermissionSelector.vue";
import { PERMISSION_GROUPS } from "@backend/constants/permissions.js";

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
    // REQUEST #1: Hide 'super_admin'
    roles.value = roleRes.data.data.filter(
      (role) =>
        role.name !== PERMISSION_GROUPS.ADMIN.SUPER_ADMIN &&
        role.name !== PERMISSION_GROUPS.ADMIN.SUB_ADMIN
    );

    // 2. Fetch Permissions
    const permRes = await roleService.getPermissions();
    const rawData = permRes.data.data;
    
    if (rawData) {
      const cleanData = {};
      for (const groupName in rawData) {
        // REQUEST #1: SKIP the entire 'admin' group
        if (groupName === "ADMIN" || groupName === "admin") continue;

        // Flatten values AND Filter out the wildcard '*' permission
        const groupPermissions = Object.values(rawData[groupName]);
        cleanData[groupName] = groupPermissions.filter(
          (perm) =>
            perm !== PERMISSION_GROUPS.ADMIN.SUPER_ADMIN &&
            perm !== PERMISSION_GROUPS.ADMIN.SUB_ADMIN
        );
      }
      permissionGroups.value = cleanData;
    }
  } catch (err) {
    console.error(err);
    showError("Failed to load data");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRoles);

// --- SELECTION LOGIC ---

const selectRole = (role) => {
  selectedRole.value = JSON.parse(JSON.stringify(role));
  // SAFETY: Ensure permissions is a FLAT array
  if (Array.isArray(selectedRole.value.permissions)) {
    selectedRole.value.permissions = selectedRole.value.permissions.flat();
  }
  isEditing.value = true;
};

const initNewRole = () => {
  selectedRole.value = { name: "", description: "", permissions: [] };
  isEditing.value = false;
};

// --- SAVE LOGIC ---

const handleSave = async () => {
  if (!selectedRole.value.name) return showError("Role Name is required");

  loading.value = true;
  try {
    const dataToSend = {
      ...selectedRole.value,
      permissions: selectedRole.value.permissions.flat(),
    };

    if (isEditing.value) {
      await roleService.updateRole(dataToSend._id, dataToSend);
      showSuccess("Role updated successfully");
    } else {
      await roleService.createRole(dataToSend);
      showSuccess("Role created successfully");
    }

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
  <div
    class="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-gray-100 p-4 md:p-6 gap-4 md:gap-6 overflow-hidden"
  >
    <div
      class="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 flex flex-col h-1/3 md:h-full"
    >
      <div class="flex justify-between items-center mb-4 flex-none">
        <h2 class="text-lg md:text-xl font-bold text-slate-800">Roles</h2>
        <button
          @click="initNewRole"
          class="text-xs md:text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
        >
          + New
        </button>
      </div>

      <div class="space-y-2 overflow-y-auto flex-grow custom-scrollbar pr-1">
        <div
          v-for="role in roles"
          :key="role._id"
          @click="selectRole(role)"
          class="p-3 rounded-lg cursor-pointer transition border border-transparent hover:border-gray-300 hover:bg-gray-50"
          :class="{
            'bg-blue-50 border-blue-200 ring-1 ring-blue-300':
              selectedRole?._id === role._id,
          }"
        >
          <div class="font-bold text-gray-800 text-sm md:text-base">
            {{ role.name }}
          </div>
          <div class="text-xs text-gray-500 truncate">
            {{ role.description || "No description" }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="w-full md:w-3/4 bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col h-2/3 md:h-full"
      v-if="selectedRole"
    >
      <div class="flex flex-col md:flex-row gap-4 mb-4 border-b pb-4 flex-none">
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-500 uppercase"
            >Role Name</label
          >
          <input
            v-model="selectedRole.name"
            type="text"
            class="w-full mt-1 p-2 border rounded font-bold text-lg"
            placeholder="e.g. Manager"
          />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-500 uppercase"
            >Description</label
          >
          <input
            v-model="selectedRole.description"
            type="text"
            class="w-full mt-1 p-2 border rounded"
            placeholder="What can this role do?"
          />
        </div>
      </div>

      <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        <PermissionSelector
          v-model="selectedRole.permissions"
          :permission-groups="permissionGroups"
        />
      </div>

      <div
        class="border-t pt-4 mt-4 flex justify-between items-center flex-none"
      >
        <button
          v-if="isEditing"
          @click="handleDelete"
          class="text-red-500 text-sm hover:text-red-700 font-medium"
        >
          Delete
        </button>
        <div v-else></div>
        <button
          @click="handleSave"
          :disabled="loading"
          class="bg-slate-800 text-white px-6 py-2 rounded-lg text-sm hover:bg-slate-900 disabled:bg-gray-400"
        >
          {{ loading ? "Saving..." : "Save" }}
        </button>
      </div>
    </div>

    <div
      v-else
      class="w-full md:w-3/4 flex items-center justify-center text-gray-400 bg-white rounded-lg shadow-md h-2/3 md:h-full"
    >
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
