<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  user: Object,
  roles: Array,
  permissions: Array
});

const emit = defineEmits(['close', 'save']);

// Local state for the form so we don't mutate parent data directly
const localUser = ref({ ...props.user });

// Watch for when the parent passes a different user to edit
watch(() => props.user, (newVal) => {
  localUser.value = { ...newVal };
}, { deep: true });

const roleHasPermission = (perm) => {
  const role = props.roles.find(r => r._id === localUser.value.role);
  return role?.permissions.includes(perm);
};

const togglePermissionState = (perm) => {
  const custom = localUser.value.customPermissions;
  const denied = localUser.value.deniedPermissions;

  const isCustom = custom.includes(perm);
  const isDenied = denied.includes(perm);

  if (!isCustom && !isDenied) {
    custom.push(perm);
  } else if (isCustom) {
    localUser.value.customPermissions = custom.filter(p => p !== perm);
    denied.push(perm);
  } else {
    localUser.value.deniedPermissions = denied.filter(p => p !== perm);
  }
};

const handleSave = () => {
  emit('save', localUser.value);
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
      <div class="p-6 border-b flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Edit Access Rights</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>

      <div class="p-6 overflow-y-auto">
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Assigned Role</label>
          <select v-model="localUser.role"
            class="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="role in roles" :key="role._id" :value="role._id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Specific Permissions <span class="font-normal text-gray-500">(Click to toggle)</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="perm in permissions" :key="perm" @click="togglePermissionState(perm)"
              class="p-3 rounded border cursor-pointer select-none transition-all flex justify-between items-center"
              :class="{
                'bg-green-50 border-green-500 ring-1 ring-green-500': localUser.customPermissions.includes(perm),
                'bg-red-50 border-red-500 ring-1 ring-red-500': localUser.deniedPermissions.includes(perm),
                'bg-white border-gray-200 hover:border-blue-300': !localUser.customPermissions.includes(perm) && !localUser.deniedPermissions.includes(perm)
              }">
              <span class="text-sm font-medium text-gray-700">{{ perm }}</span>
              <span v-if="localUser.customPermissions.includes(perm)"
                class="text-xs font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded">ALLOWED</span>
              <span v-else-if="localUser.deniedPermissions.includes(perm)"
                class="text-xs font-bold text-red-700 bg-red-200 px-2 py-0.5 rounded">BANNED</span>
              <span v-else class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                {{ roleHasPermission(perm) ? 'Inherited: On' : 'Inherited: Off' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
        <button @click="$emit('close')"
          class="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded font-medium">Cancel</button>
        <button @click="handleSave" class="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">Save
          Changes</button>
      </div>
    </div>
  </div>
</template>