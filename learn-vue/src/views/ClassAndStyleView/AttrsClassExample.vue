<script setup lang="ts">
import { ref } from 'vue'

const applyHighlight = ref(false)

// Child component definition
const ChildComponent = `
<!-- MyComponent template using \`$attrs\` -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
`
</script>

<template>
  <div class="space-y-2 p-4 border border-gray-300 rounded">
    <h3 class="font-semibold">Class Binding: $attrs Forwarding</h3>
    <p class="text-sm text-gray-600">Forward classes from parent to child using $attrs.class</p>

    <div class="space-y-3">
      <!-- Example showing child component receiving classes via $attrs -->
      <p :class="applyHighlight && 'highlight'" class="px-4 py-2 border rounded">
        Hi!
      </p>
      <span class="text-gray-600">This is a child component</span>
    </div>

    <div class="flex gap-2">
      <button @click="applyHighlight = !applyHighlight" class="px-3 py-1 bg-blue-500 text-white rounded">
        Toggle highlight: {{ applyHighlight }}
      </button>
    </div>

    <div class="space-y-2">
      <p class="text-sm font-semibold">Child Component Template:</p>
      <pre class="text-xs bg-gray-100 p-2 rounded overflow-auto">{{ ChildComponent }}</pre>
    </div>

    <div class="space-y-2">
      <p class="text-sm font-semibold">Parent Usage:</p>
      <pre
        class="text-xs bg-gray-100 p-2 rounded overflow-auto">&lt;MyComponent :class="{ highlight: applyHighlight }" /&gt;</pre>
    </div>
  </div>
</template>

<style scoped>
.highlight {
  background-color: #fef08a;
  border-color: #eab308;
  font-weight: 500;
}
</style>
