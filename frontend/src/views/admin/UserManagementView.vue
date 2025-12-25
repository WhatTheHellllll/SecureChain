<script setup>
import { ref, onMounted } from "vue";
import adminService from "../../services/adminService.js";
import roleService from "../../services/roleService.js";
import UserEditModal from "../../components/admin/UserEditModal.vue";
import { PERMISSION_GROUPS } from "@backend/constants/permissions.js";
import { ROLES } from "@backend/constants/roles.js";
import { useCrud } from "../../composables/useCrud.js";
import { Pencil, Trash2, RefreshCw } from "lucide-vue-next";
import BaseButton from "../../components/base/BaseButton.vue";

const users = ref([]);
const roles = ref([]);
const permissionGroups = ref({});
const showModal = ref(false);
const selectedUser = ref(null);
const { isPending, executeAction, confirmAndRemove } = useCrud();

const fetchData = async () => {
  // Use executeAction even for fetching to handle the loading state automatically via isPending
  await executeAction(async () => {
    const [userRes, roleRes, permRes] = await Promise.all([
      adminService.getAllUsers(),
      roleService.getRoles(),
      roleService.getPermissions(),
    ]);

    users.value = userRes.data.data;

    roles.value = roleRes.data.data
      .filter((r) => r.name !== ROLES.SUPER_ADMIN && r.name !== ROLES.SUB_ADMIN)
      .map((r) => ({ ...r, permissions: r.permissions.flat() }));

    const rawData = permRes.data.data;
    if (rawData) {
      const cleanData = {};
      for (const groupName in rawData) {
        if (groupName === "ADMIN" || groupName === "admin") continue;
        const groupValues = Object.values(rawData[groupName]);
        cleanData[groupName] = groupValues.filter(
          (p) => p !== PERMISSION_GROUPS.ADMIN.SUPER_ADMIN
        );
      }
      permissionGroups.value = cleanData;
    }
  }, ""); // Empty string because we don't need a "Success" popup for just loading data
};
onMounted(fetchData);

const openEdit = (user) => {
  selectedUser.value = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role?._id || user.role,
    roleName: user.role?.name,
    customPermissions: [...(user.customPermissions || [])],
    deniedPermissions: [...(user.deniedPermissions || [])],
  };
  showModal.value = true;
};

const handleSave = async (updatedUserData) => {
  const apiCall = () =>
    adminService.updateUser(updatedUserData._id, {
      roleId: updatedUserData.role,
      customPermissions: updatedUserData.customPermissions,
      deniedPermissions: updatedUserData.deniedPermissions,
    });

  const result = await executeAction(apiCall, "User updated successfully");

  if (result.success) {
    showModal.value = false;
    await fetchData();
  }
};

const handleDelete = async (user) => {
  const result = await confirmAndRemove(
    () => adminService.deleteUser(user._id),
    user.name
  );

  if (result.success) {
    await fetchData();
  }
};
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
      <button
        @click="fetchData"
        :disabled="isPending"
        class="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition disabled:opacity-50"
      >
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isPending }" />
        <span class="text-sm font-medium">Refresh</span>
      </button>
    </div>

    <div v-if="isPending" class="text-center py-10 text-gray-500">
      Loading users...
    </div>

    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="w-full text-left border-collapse">
        <thead
          class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold"
        >
          <tr>
            <th class="p-4 border-b">User</th>
            <th class="p-4 border-b">Role</th>
            <th class="p-4 border-b">Custom Access</th>
            <th class="p-4 border-b text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user._id"
            class="hover:bg-gray-50 border-b last:border-0"
          >
            <td class="p-4">
              <div class="font-medium text-gray-900">{{ user.name }}</div>
              <div class="text-sm text-gray-500">{{ user.email }}</div>
            </td>
            <td class="p-4">
              <span
                class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold"
              >
                {{ user.role?.name || "No Role" }}
              </span>
            </td>
            <td class="p-4 text-sm">
              <span
                v-if="user.customPermissions?.length > 0"
                class="text-green-600 font-medium mr-3"
              >
                +{{ user.customPermissions.length }} Added
              </span>
              <span
                v-if="user.deniedPermissions?.length > 0"
                class="text-red-600 font-medium"
              >
                -{{ user.deniedPermissions.length }} Banned
              </span>
              <span
                v-if="
                  !user.customPermissions?.length &&
                  !user.deniedPermissions?.length
                "
                class="text-gray-400 italic"
              >
                Default
              </span>
            </td>
            <td class="p-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <BaseButton
                  variant="icon"
                  @click="openEdit(user)"
                  :disabled="isPending"
                  title="Edit User"
                  class="text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Pencil class="w-4 h-4" />
                </BaseButton>

                <BaseButton
                  variant="icon"
                  @click="handleDelete(user)"
                  :disabled="isPending"
                  title="Deactivate User"
                  class="text-gray-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 class="w-4 h-4" />
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UserEditModal
      :show="showModal"
      :user="selectedUser"
      :roles="roles"
      :permission-groups="permissionGroups"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>
