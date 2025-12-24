<script setup>
import { ref, onMounted } from "vue";
import adminService from "../../services/adminService.js";
import roleService from "../../services/roleService.js";
import { showError } from "../../utils/alert.js";
import UserEditModal from "../../components/admin/UserEditModal.vue";
import { PERMISSION_GROUPS } from "@backend/constants/permissions.js";
import { ROLES } from "@backend/constants/roles.js";

const users = ref([]);
const roles = ref([]);
// CHANGE: Store as an Object (Groups), not a flat Array
const permissionGroups = ref({});
const showModal = ref(false);
const loading = ref(false);
const saving = ref(false);
const selectedUser = ref(null);

const fetchData = async () => {
  loading.value = true;
  try {
    // 1. Fetch all data in parallel
    const [userRes, roleRes, permRes] = await Promise.all([
      adminService.getAllUsers(),
      roleService.getRoles(),
      roleService.getPermissions(),
    ]);

    // 2. USERS: The backend now sends ONLY manageable users.
    // We just set the value directly.
    users.value = userRes.data.data;

    // 3. ROLES: Still filter out high-level roles so admins can't assign them
    roles.value = roleRes.data.data
      .filter(
        (role) =>
          role.name !== ROLES.SUPER_ADMIN && role.name !== ROLES.SUB_ADMIN
      )
      .map((role) => ({
        ...role,
        permissions: role.permissions.flat(),
      }));

    // 4. PERMISSIONS: Grouping & Filtering
    const rawData = permRes.data.data;
    if (rawData) {
      const cleanData = {};
      for (const groupName in rawData) {
        // Skip ADMIN group (danger zone)
        if (groupName === "ADMIN" || groupName === "admin") continue;

        const groupValues = Object.values(rawData[groupName]);

        // Filter out the Super Admin wildcard
        cleanData[groupName] = groupValues.filter(
          (p) => p !== PERMISSION_GROUPS.ADMIN.SUPER_ADMIN
        );
      }
      permissionGroups.value = cleanData;
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    showError("Failed to load management data");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const openEdit = (user) => {
  selectedUser.value = {
    _id: user._id,
    // Handle populated role object or direct ID
    role: user.role?._id || user.role,
    roleName: user.role?.name, // Pass name to check for super_admin
    customPermissions: [...(user.customPermissions || [])],
    deniedPermissions: [...(user.deniedPermissions || [])],
  };
  showModal.value = true;
};

const handleSave = async (updatedUserData) => {
  saving.value = true;
  try {
    await adminService.updateUser(updatedUserData._id, {
      roleId: updatedUserData.role,
      customPermissions: updatedUserData.customPermissions,
      deniedPermissions: updatedUserData.deniedPermissions,
    });
    showModal.value = false;
    await fetchData();
  } catch (err) {
    showError(err.response?.data?.message || "Failed to update user");
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
      <button @click="fetchData" class="text-blue-600 hover:underline text-sm">
        Refresh Data
      </button>
    </div>

    <div v-if="loading" class="text-center py-10 text-gray-500">
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
              <button
                @click="openEdit(user)"
                class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded text-sm font-medium transition"
              >
                Edit
              </button>
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
