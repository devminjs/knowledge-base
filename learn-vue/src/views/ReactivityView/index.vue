<script setup lang="ts">
import RefExample from './RefExample.vue'
import ReactiveExample from './ReactiveExample.vue'
</script>

<template>
  <div class="space-y-6">
    <!-- ===== WHEN TO CHOOSE EACH ===== -->
    <!-- Choose REF for:
      - Single values (strings, numbers, booleans)
      - When you need to reassign the entire value
      - Simple counters, toggles, timestamps
      - When you might want to swap the entire object
    -->
    <RefExample />

    <!-- Choose REACTIVE for:
      - Objects with multiple related properties
      - Form data, component state with many fields
      - When you want cleaner syntax without .value everywhere
      - When properties are always accessed together as a group
    -->
    <ReactiveExample />
  </div>
</template>
