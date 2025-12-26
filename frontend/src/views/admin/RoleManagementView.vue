<script setup>
import { ref, onMounted, pushScopeId } from "vue";
import roleService from "../../services/roleService.js";
import { showError } from "../../utils/alert.js";
import PermissionSelector from "../../components/admin/PermissionSelector.vue";
import { ROLES } from "@backend/constants/roles.js";
import { PERMISSION_GROUPS } from "@backend/constants/permissions.js";
import { useCrud } from "../../composables/useCrud.js";
import {
  Plus,
  Trash2,
  Save,
  Shield,
  ShieldAlert,
  Edit2,
} from "lucide-vue-next";
import BaseButton from "../../components/base/BaseButton.vue";
import BaseInput from "../../components/base/BaseInput.vue";
import BaseModal from "../../components/base/BaseModal.vue";
import { useRouter } from "vue-router";
// COMPOSABLE
const { isPending, executeAction, confirmAndRemove } = useCrud();
// STATE
const roles = ref([]);
const selectedRole = ref({ name: "", description: "", permissions: [] });
const loading = ref(false); // Used for initial fetch only
const isEditing = ref(false);
const permissionGroups = ref({});
const showModal = ref(false);
const router = useRouter();

const fetchRoles = async () => {
  try {
    loading.value = true;
    const roleRes = await roleService.getRoles();

    roles.value = roleRes.data.data
      .filter(
        (role) =>
          role.name !== ROLES.SUPER_ADMIN && role.name !== ROLES.SUB_ADMIN
      )
      .map((role) => ({
        ...role,
        permissions: Array.isArray(role.permissions)
          ? role.permissions.flat()
          : [],
      }));

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

const handleSave = async () => {
  if (!selectedRole.value.name) return showError("Role Name is required");

  const dataToSend = { ...selectedRole.value };
  const apiCall = isEditing.value
    ? () => roleService.updateRole(dataToSend._id, dataToSend)
    : () => roleService.createRole(dataToSend);

  const result = await executeAction(apiCall, "Role saved successfully");

  if (result.success) {
    await fetchRoles();
    router.push({ name: "admin-roles" });
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

const openEditModal = (role) => {
  // Deep copy to avoid modifying the list while editing
  selectedRole.value = JSON.parse(JSON.stringify(role));

  // Ensure permissions is a flat array
  if (Array.isArray(selectedRole.value.permissions)) {
    selectedRole.value.permissions = selectedRole.value.permissions.flat();
  }

  isEditing.value = true;
  showModal.value = true;
};

const openCreateModal = () => {
  selectedRole.value = { name: "", description: "", permissions: [] };
  isEditing.value = false;
  showModal.value = true;
};

</script>
<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShieldAlert class="text-indigo-600" />
          Role Management
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          Define access levels and permissions for your team.
        </p>
      </div>

      <BaseButton variant="primary" @click="openCreateModal">
        <template #icon><Plus class="w-4 h-4" /></template>
        Create Role
      </BaseButton>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <span class="text-indigo-600 animate-pulse font-medium"
        >Loading roles...</span
      >
    </div>

    <div
      v-else-if="roles.length === 0"
      class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100"
    >
      <Shield class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-gray-900">No Roles Found</h3>
      <p class="text-gray-500 mb-4">Get started by creating a new role.</p>
      <BaseButton variant="primary" @click="openCreateModal"
        >Create Role</BaseButton
      >
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="role in roles"
        :key="role._id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group relative"
      >
        <div class="flex items-start justify-between mb-4">
          <div
            class="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors"
          >
            <Shield class="w-6 h-6 text-indigo-600" />
          </div>
          <button
            @click="openEditModal(role)"
            class="text-gray-400 hover:text-indigo-600 transition-colors p-1"
            title="Edit Role"
          >
            <Edit2 class="w-4 h-4" />
          </button>
        </div>

        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ role.name }}</h3>
        <p class="text-sm text-gray-500 mb-4 h-10 line-clamp-2">
          {{ role.description || "No description provided." }}
        </p>

        <div
          class="flex items-center justify-between pt-4 border-t border-gray-50"
        >
          <span
            class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded"
          >
            {{ role.permissions?.length || 0 }} Permissions
          </span>
          <span
            class="text-xs text-indigo-600 font-medium cursor-pointer hover:underline"
            @click="openEditModal(role)"
          >
            View Details
          </span>
        </div>
      </div>
    </div>

    <BaseModal
      :show="showModal"
      :title="isEditing ? 'Edit Role' : 'Create New Role'"
      max-width="4xl"
      @close="showModal = false"
    >
      <form v-if="selectedRole" @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="selectedRole.name"
            label="Role Name"
            placeholder="e.g. Inventory Manager"
            required
          />
          <BaseInput
            v-model="selectedRole.description"
            label="Description"
            placeholder="What can this role do?"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-3 flex justify-between items-center"
          >
            <span>Permissions</span>
            <span
              class="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
            >
              {{ selectedRole.permissions?.length || 0 }} selected
            </span>
          </label>

          <div
            class="h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50/50 custom-scrollbar"
          >
            <PermissionSelector
              v-model="selectedRole.permissions"
              :permission-groups="permissionGroups"
            />
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex-1">
          <BaseButton
            v-if="isEditing"
            variant="danger"
            @click="handleDelete"
            :loading="isPending"
          >
            <template #icon><Trash2 class="w-4 h-4" /></template>
            Delete Role
          </BaseButton>
        </div>

        <div class="flex gap-3">
          <BaseButton variant="secondary" @click="showModal = false">
            Cancel
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="handleSave"
            :loading="isPending"
          >
            <template #icon><Save class="w-4 h-4" /></template>
            {{ isEditing ? "Save Changes" : "Create Role" }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
/* Only need scrollbar styling now, modal handles layout */
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
