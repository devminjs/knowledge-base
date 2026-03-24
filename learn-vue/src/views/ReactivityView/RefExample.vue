<script setup lang="ts">
import { ref } from 'vue'

import Button from '~/components/ui/Button.vue'

// ===== REF: Single primitive value =====
// Use ref() when you have a single value that needs to be reactive
// Pros: Simple, direct assignment, works great for primitives
// Cons: Requires .value access in script (though auto-unwrapped in templates)
const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <div class="space-y-2 p-4 border border-gray-300 rounded">
    <h3 class="font-semibold">REF Example (Single Value)</h3>
    <p>Count = <span class="font-bold">{{ count }}</span></p>
    <Button label="Increment" @click="increment" />
  </div>
</template>
