<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => [],
  },
  permissionGroups: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

const hasPermission = (perm) => {
  return props.modelValue.includes(perm);
};

const togglePermission = (perm) => {
  const newPerms = [...props.modelValue];
  if (newPerms.includes(perm)) {
    const index = newPerms.indexOf(perm);
    newPerms.splice(index, 1);
  } else {
    newPerms.push(perm);
  }
  emit("update:modelValue", newPerms);
};

const isGroupSelected = (groupKey) => {
  const groupPerms = props.permissionGroups[groupKey];
  if (!groupPerms || groupPerms.length === 0) return false;
  return groupPerms.every((p) => props.modelValue.includes(p));
};

const toggleGroup = (groupKey) => {
  const groupPerms = props.permissionGroups[groupKey];
  if (!groupPerms) return;

  const allSelected = isGroupSelected(groupKey);
  let newPerms = [...props.modelValue];

  if (allSelected) {
    // Uncheck all in group
    newPerms = newPerms.filter((p) => !groupPerms.includes(p));
  } else {
    // Check all (add missing)
    const missing = groupPerms.filter((p) => !newPerms.includes(p));
    newPerms.push(...missing);
  }
  emit("update:modelValue", newPerms);
};
</script>

<template>
  <div>
    <div
      v-for="(perms, groupName) in permissionGroups"
      :key="groupName"
      class="mb-6"
    >
      <div
        class="flex items-center justify-between mb-2 bg-gray-50 p-2 rounded sticky top-0 z-10"
      >
        <h3 class="font-bold text-sm md:text-base text-slate-700">
          {{ groupName }}
        </h3>
        <button
          @click="toggleGroup(groupName)"
          class="text-xs font-bold px-2 py-1 rounded transition"
          :class="
            isGroupSelected(groupName)
              ? 'bg-red-100 text-red-600'
              : 'bg-green-100 text-green-600'
          "
        >
          {{ isGroupSelected(groupName) ? "Uncheck All" : "Check All" }}
        </button>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        <div
          v-for="perm in perms"
          :key="perm"
          @click="togglePermission(perm)"
          class="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent transition"
          :class="{ 'border-blue-300 bg-blue-50': hasPermission(perm) }"
        >
          <div
            class="w-4 h-4 md:w-5 md:h-5 rounded border flex-none flex items-center justify-center transition"
            :class="
              hasPermission(perm)
                ? 'bg-blue-600 border-blue-600'
                : 'border-gray-300 bg-white'
            "
          >
            <span v-if="hasPermission(perm)" class="text-white text-[10px]"
              >✓</span
            >
          </div>
          <span class="text-xs md:text-sm text-gray-700 select-none break-all">
            {{ perm }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
