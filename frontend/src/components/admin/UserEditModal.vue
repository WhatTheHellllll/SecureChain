<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  show: Boolean,
  user: Object,
  roles: Array,
  permissionGroups: Object, // Changed from Array to Object
});

const emit = defineEmits(["close", "save"]);

const localUser = ref({ ...props.user });

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

// --- HELPER LOGIC ---

// Check if the BASE role has this permission
const roleHasPermission = (perm) => {
  const role = props.roles.find((r) => r._id === localUser.value.role);
  return role?.permissions.includes(perm);
};

// Tri-state toggle: Default -> Allowed -> Denied -> Default
// Safer toggle logic: Directly modifies the arrays to prevent "Stale State"
const togglePermissionState = (perm) => {
  // 1. Check the current state dynamically
  const isCustom = localUser.value.customPermissions.includes(perm);
  const isDenied = localUser.value.deniedPermissions.includes(perm);
  const isInherited = roleHasPermission(perm);

  if (isInherited) {
    if (isDenied) {
      // Un-ban it (Back to Inherited)
      localUser.value.deniedPermissions =
        localUser.value.deniedPermissions.filter((p) => p !== perm);
    } else {
      // Ban it (Override Inheritance)
      // Also ensure we remove from custom if it somehow got there, to clean DB
      if (isCustom) {
        localUser.value.customPermissions =
          localUser.value.customPermissions.filter((p) => p !== perm);
      }
      localUser.value.deniedPermissions = [
        ...localUser.value.deniedPermissions,
        perm,
      ];
    }
    return;
  }
  if (!isCustom && !isDenied) {
    // STATE 1: Default -> move to ALLOWED
    // Add to custom, ensure it's not in denied
    localUser.value.customPermissions = [
      ...localUser.value.customPermissions,
      perm,
    ];
  } else if (isCustom) {
    // STATE 2: Allowed -> move to BANNED
    // Remove from custom
    localUser.value.customPermissions =
      localUser.value.customPermissions.filter((p) => p !== perm);
    // Add to denied
    localUser.value.deniedPermissions = [
      ...localUser.value.deniedPermissions,
      perm,
    ];
  } else {
    // STATE 3: Banned -> move to DEFAULT
    // Remove from denied
    localUser.value.deniedPermissions =
      localUser.value.deniedPermissions.filter((p) => p !== perm);
  }
};

const handleSave = () => {
  emit("save", localUser.value);
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]"
    >
      <div class="p-6 border-b flex justify-between items-center flex-none">
        <h2 class="text-xl font-bold text-gray-800">Edit Access Rights</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-grow custom-scrollbar">
        <div class="mb-8">
          <label class="block text-sm font-bold text-gray-700 mb-2"
            >Assigned Role</label
          >
          <div class="relative">
            <select
              v-model="localUser.role"
              class="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option v-for="role in roles" :key="role._id" :value="role._id">
                {{ role.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-4">
            Specific Permissions
            <span class="font-normal text-gray-500"
              >(Click to cycle: Default -> Allow -> Ban)</span
            >
          </label>

          <div
            v-for="(perms, groupName) in permissionGroups"
            :key="groupName"
            class="mb-6"
          >
            <div
              class="flex items-center justify-between mb-2 bg-gray-50 p-2 rounded sticky top-0 z-10"
            >
              <h3
                class="font-bold text-sm md:text-base text-slate-700 uppercase tracking-wide"
              >
                {{ groupName }}
              </h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div
                v-for="perm in perms"
                :key="perm"
                @click="togglePermissionState(perm)"
                class="p-2 rounded border cursor-pointer select-none transition-all flex flex-col justify-center gap-1 relative h-16"
                :class="{
                  // 1. Explicitly ALLOWED (Strong Green + Ring)
                  'bg-green-50 border-green-500 ring-1 ring-green-500':
                    localUser.customPermissions.includes(perm),

                  // 2. Explicitly BANNED (Red)
                  'bg-red-50 border-red-500 ring-1 ring-red-500':
                    localUser.deniedPermissions.includes(perm),

                  // 3. INHERITED (Soft Green - New Request)
                  // It checks: Not custom AND Not denied AND Role has it
                  'bg-green-50 border-green-300':
                    !localUser.customPermissions.includes(perm) &&
                    !localUser.deniedPermissions.includes(perm) &&
                    roleHasPermission(perm),

                  // 4. INACTIVE (White)
                  'bg-white border-gray-200 hover:border-blue-300':
                    !localUser.customPermissions.includes(perm) &&
                    !localUser.deniedPermissions.includes(perm) &&
                    !roleHasPermission(perm),
                }"
              >
                <span
                  class="text-xs font-semibold text-gray-700 break-all leading-tight"
                >
                  {{ perm }}
                </span>

                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-700">{{
                    perm
                  }}</span>

                  <span
                    v-if="localUser.customPermissions.includes(perm)"
                    class="text-xs font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded"
                  >
                    ALLOWED
                  </span>
                  <span
                    v-else-if="localUser.deniedPermissions.includes(perm)"
                    class="text-xs font-bold text-red-700 bg-red-200 px-2 py-0.5 rounded"
                  >
                    BANNED
                  </span>
                  <span
                    v-else
                    class="text-[10px] font-medium px-2 py-1 rounded border transition-colors duration-200"
                    :class="
                      roleHasPermission(perm)
                        ? 'text-green-700 bg-green-100 border-green-200' /* ON = GREEN */
                        : 'text-gray-400 bg-gray-100 border-gray-200' /* OFF = GRAY */
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

      <div
        class="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3 flex-none"
      >
        <button
          @click="$emit('close')"
          class="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded font-medium"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          class="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 shadow-md transform active:scale-95 transition"
        >
          Save Changes
        </button>
      </div>
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
