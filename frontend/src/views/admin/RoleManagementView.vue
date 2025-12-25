<script setup>
import { ref, onMounted } from "vue";
import roleService from "../../services/roleService.js";
import { showError } from "../../utils/alert.js";
import PermissionSelector from "../../components/admin/PermissionSelector.vue";
import { ROLES } from "@backend/constants/roles.js";
import { PERMISSION_GROUPS } from "@backend/constants/permissions.js";
import { useCrud } from "../../composables/useCrud.js";
import { Plus, Trash2, Save, Shield, ShieldAlert } from "lucide-vue-next";
import BaseButton from "../../components/base/BaseButton.vue";

// STATE
const roles = ref([]);
const selectedRole = ref(null);
const loading = ref(false); // Used for initial fetch only
const isEditing = ref(false);
const permissionGroups = ref({});

// COMPOSABLE
const { isPending, executeAction, confirmAndRemove } = useCrud();

const fetchRoles = async () => {
  try {
    loading.value = true;
    const roleRes = await roleService.getRoles();
    roles.value = roleRes.data.data.filter(
      (role) => role.name !== ROLES.SUPER_ADMIN && role.name !== ROLES.SUB_ADMIN
    );

    const permRes = await roleService.getPermissions();
    const rawData = permRes.data.data;

    if (rawData) {
      const cleanData = {};
      for (const groupName in rawData) {
        if (groupName === "ADMIN" || groupName === "admin") continue;
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

const selectRole = (role) => {
  selectedRole.value = JSON.parse(JSON.stringify(role));
  if (Array.isArray(selectedRole.value.permissions)) {
    selectedRole.value.permissions = selectedRole.value.permissions.flat();
  }
  isEditing.value = true;
};

const initNewRole = () => {
  selectedRole.value = { name: "", description: "", permissions: [] };
  isEditing.value = false;
};

const handleSave = async () => {
  if (!selectedRole.value.name) return showError("Role Name is required");

  const dataToSend = { ...selectedRole.value };
  const apiCall = isEditing.value
    ? () => roleService.updateRole(dataToSend._id, dataToSend)
    : () => roleService.createRole(dataToSend);

  const result = await executeAction(apiCall, "Role saved successfully");

  if (result.success) {
    await fetchRoles();
    selectedRole.value = null;
  }
};

const handleDelete = async () => {
  const result = await confirmAndRemove(
    () => roleService.deleteRole(selectedRole.value._id),
    selectedRole.value.name
  );

  if (result.success) {
    selectedRole.value = null;
    await fetchRoles();
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
      <div class="flex justify-between items-center mb-6 flex-none">
        <h2
          class="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2"
        >
          <ShieldAlert class="w-5 h-5 text-slate-600" />
          <span>Roles</span>
        </h2>

        <button
          @click="initNewRole"
          class="flex items-center gap-1 text-xs md:text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 transition font-medium"
        >
          <Plus class="w-3 h-3 md:w-4 md:h-4" />
          <span>New</span>
        </button>
      </div>

      <div class="space-y-2 overflow-y-auto flex-grow custom-scrollbar pr-1">
        <div v-if="loading" class="text-center py-4 text-gray-400 text-sm">
          Loading...
        </div>

        <div
          v-else
          v-for="role in roles"
          :key="role._id"
          @click="selectRole(role)"
          class="group p-3 rounded-lg cursor-pointer transition border border-transparent hover:border-gray-300 hover:bg-gray-50"
          :class="{
            'bg-blue-50 border-blue-200 ring-1 ring-blue-300':
              selectedRole?._id === role._id,
          }"
        >
          <div class="flex items-start gap-3">
            <Shield
              class="w-5 h-5 flex-none mt-0.5 transition-colors"
              :class="
                selectedRole?._id === role._id
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-600'
              "
            />

            <div class="flex flex-col overflow-hidden">
              <div
                class="font-bold text-gray-800 text-sm md:text-base truncate leading-snug"
              >
                {{ role.name }}
              </div>
              <div class="text-xs text-gray-500 truncate mt-0.5">
                {{ role.description || "No description" }}
              </div>
            </div>
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
            class="w-full mt-1 p-2 border rounded font-bold text-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition"
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
            class="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition"
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
        <BaseButton
          v-if="isEditing"
          variant="danger"
          @click="handleDelete"
          :loading="isPending"
        >
          <template #icon><Trash2 class="w-4 h-4" /></template>
          Delete Role
        </BaseButton>

        <div v-else></div>

        <BaseButton variant="primary" @click="handleSave" :loading="isPending">
          <template #icon><Save class="w-4 h-4" /></template>
          {{ isPending ? "Saving..." : "Save Changes" }}
        </BaseButton>
      </div>
    </div>

    <div
      v-else
      class="w-full md:w-3/4 flex flex-col items-center justify-center text-gray-400 bg-white rounded-lg shadow-md h-2/3 md:h-full gap-4"
    >
      <div class="p-4 bg-gray-50 rounded-full">
        <Shield class="w-12 h-12 text-gray-300" />
      </div>
      <p>Select a role from the left to edit permissions</p>
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
