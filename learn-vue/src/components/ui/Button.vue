<script setup lang="ts">
defineProps<{
  label: string
  type?: 'button' | 'submit' | 'reset'
}>()

defineEmits<{
  click: []
}>()

</script>

<template>
  <button :type="type || 'button'" class="px-4 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
    @click="$emit('click')">
    {{ label }}
  </button>
</template>
