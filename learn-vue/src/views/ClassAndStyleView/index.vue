<script setup lang="ts">
import ClassAndStyleBindings from './ClassAndStyleBindings.vue'
import AttrsClassExample from './AttrsClassExample.vue'
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold mb-6">Class & Style Binding</h1>
      <ClassAndStyleBindings />
    </div>

    <div>
      <h1 class="text-2xl font-bold mb-6">Attribute Forwarding</h1>
      <AttrsClassExample />
    </div>
  </div>
</template>
