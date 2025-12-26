<script setup>
import { ref, watch } from "vue";
// 1. IMPORT BASE COMPONENTS
import BaseModal from "../base/BaseModal.vue";
import BaseButton from "../base/BaseButton.vue";
import { Save, X } from "lucide-vue-next";

const props = defineProps({
  show: Boolean,
  user: Object,
  roles: Array,
  permissionGroups: Object,
});

const emit = defineEmits(["close", "save"]);

const localUser = ref({ ...props.user });

// Keep existing Watch Logic
watch(
  () => props.user,
  (newVal) => {
    localUser.value = {
      ...newVal,
      customPermissions: newVal?.customPermissions
        ? [...newVal.customPermissions]
        : [],
      deniedPermissions: newVal?.deniedPermissions
        ? [...newVal.deniedPermissions]
        : [],
    };
  },
  { deep: true, immediate: true }
);

// --- LOGIC ---

const roleHasPermission = (perm) => {
  const role = props.roles.find((r) => r._id === localUser.value.role);
  return role?.permissions.includes(perm);
};

// Toggle Logic (Kept exactly the same)
const togglePermissionState = (perm) => {
  const isCustom = localUser.value.customPermissions.includes(perm);
  const isDenied = localUser.value.deniedPermissions.includes(perm);
  const isInherited = roleHasPermission(perm);

  if (isInherited) {
    if (isDenied) {
      localUser.value.deniedPermissions =
        localUser.value.deniedPermissions.filter((p) => p !== perm);
    } else {
      if (isCustom)
        localUser.value.customPermissions =
          localUser.value.customPermissions.filter((p) => p !== perm);
      localUser.value.deniedPermissions = [
        ...localUser.value.deniedPermissions,
        perm,
      ];
    }
    return;
  }
  if (!isCustom && !isDenied) {
    localUser.value.customPermissions = [
      ...localUser.value.customPermissions,
      perm,
    ];
  } else if (isCustom) {
    localUser.value.customPermissions =
      localUser.value.customPermissions.filter((p) => p !== perm);
    localUser.value.deniedPermissions = [
      ...localUser.value.deniedPermissions,
      perm,
    ];
  } else {
    localUser.value.deniedPermissions =
      localUser.value.deniedPermissions.filter((p) => p !== perm);
  }
};

const handleSave = () => {
  emit("save", localUser.value);
};

// Readable Label Helper
const formatLabel = (perm) => {
  if (!perm) return "";
  const parts = perm.split(".");
  const label = parts[parts.length - 1];
  return label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>

<template>
  <BaseModal
    :show="show"
    title="Edit Access Rights"
    max-width="4xl"
    @close="$emit('close')"
  >
    <div>
      <div
        class="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold"
        >
          {{ user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <p class="text-sm font-bold text-gray-900">{{ user?.name }}</p>
          <p class="text-xs text-gray-500">{{ user?.email }}</p>
        </div>
      </div>

      <div class="mb-8">
        <label class="block text-sm font-bold text-gray-700 mb-2"
          >Assigned Role</label
        >
        <div class="relative">
          <select
            v-model="localUser.role"
            class="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option v-for="role in roles" :key="role._id" :value="role._id">
              {{ role.name }}
            </option>
          </select>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-end mb-4">
          <label class="block text-sm font-bold text-gray-700"
            >Specific Permissions</label
          >
          <span class="text-xs text-gray-400 font-normal"
            >Click items to cycle: Default → Allow → Ban</span
          >
        </div>

        <div
          class="h-[400px] overflow-y-auto pr-2 custom-scrollbar border border-gray-200 rounded-lg p-4 bg-gray-50/50"
        >
          <div
            v-for="(perms, groupName) in permissionGroups"
            :key="groupName"
            class="mb-8 last:mb-0"
          >
            <h3
              class="font-bold text-xs text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1"
            >
              {{ groupName }}
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="perm in perms"
                :key="perm"
                @click="togglePermissionState(perm)"
                class="p-3 rounded-lg border cursor-pointer select-none transition-all relative group"
                :class="{
                  // ALLOWED (Green)
                  'bg-green-50 border-green-500 ring-1 ring-green-500':
                    localUser.customPermissions.includes(perm),

                  // BANNED (Red)
                  'bg-red-50 border-red-500 ring-1 ring-red-500':
                    localUser.deniedPermissions.includes(perm),

                  // INHERITED (Indigo)
                  'bg-indigo-50 border-indigo-200':
                    !localUser.customPermissions.includes(perm) &&
                    !localUser.deniedPermissions.includes(perm) &&
                    roleHasPermission(perm),

                  // DEFAULT (White)
                  'bg-white border-gray-200 hover:border-indigo-300':
                    !localUser.customPermissions.includes(perm) &&
                    !localUser.deniedPermissions.includes(perm) &&
                    !roleHasPermission(perm),
                }"
              >
                <div class="flex justify-between items-start mb-1">
                  <span class="text-xs font-semibold text-gray-700 break-all">{{
                    formatLabel(perm)
                  }}</span>
                </div>

                <div class="mt-2">
                  <span
                    v-if="localUser.customPermissions.includes(perm)"
                    class="text-[10px] font-bold text-green-700 bg-green-200 px-1.5 py-0.5 rounded"
                    >ALLOWED</span
                  >
                  <span
                    v-else-if="localUser.deniedPermissions.includes(perm)"
                    class="text-[10px] font-bold text-red-700 bg-red-200 px-1.5 py-0.5 rounded"
                    >BANNED</span
                  >
                  <span
                    v-else
                    class="text-[10px] font-medium px-1.5 py-0.5 rounded border transition-colors"
                    :class="
                      roleHasPermission(perm)
                        ? 'text-indigo-700 bg-indigo-100 border-indigo-200'
                        : 'text-gray-400 bg-gray-100 border-gray-200'
                    "
                  >
                    Inherited: {{ roleHasPermission(perm) ? "On" : "Off" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="$emit('close')">
        Cancel
      </BaseButton>
      <BaseButton variant="primary" @click="handleSave">
        <template #icon><Save class="w-4 h-4" /></template>
        Save Access Rights
      </BaseButton>
    </template>
  </BaseModal>
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
