<script setup lang="ts">
import { ref, reactive } from 'vue'

import Button from '~/components/ui/Button.vue'

// ===== REACTIVE: Complex object with multiple properties =====
// Use reactive() when you have an object with multiple related properties
// Pros: No .value needed, natural dot notation for properties, better for grouped data
// Cons: Only works with objects/arrays, loses reactivity if you destructure, can't reassign root
// Example: A form object with multiple fields that should stay together
const formState = reactive({
  name: '',
  email: '',
  age: 0,
  submitted: false
})

// Track submission state with a delay to see reactive UI updates
const isSubmitting = ref(false)

async function handleSubmit() {
  // With reactive, we can naturally access properties without .value
  isSubmitting.value = true

  // Simulate network request with a 2-second delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  formState.submitted = true
  isSubmitting.value = false
  console.log(`Submitted: ${formState.name}, ${formState.email}`)
}
</script>

<template>
  <div class="space-y-2 p-4 border border-gray-300 rounded">
    <h3 class="font-semibold">REACTIVE Example (Form Object)</h3>
    <div class="space-y-2">
      <div>
        <label class="block text-sm">Name:</label>
        <input v-model="formState.name" class="border border-gray-300 px-2 py-1 w-full" />
      </div>
      <div>
        <label class="block text-sm">Email:</label>
        <input v-model="formState.email" class="border border-gray-300 px-2 py-1 w-full" />
      </div>
      <div>
        <label class="block text-sm">Age:</label>
        <input v-model.number="formState.age" type="number" class="border border-gray-300 px-2 py-1 w-full" />
      </div>
    </div>
    <Button :label="isSubmitting ? 'Submitting...' : 'Submit'" @click="handleSubmit" :disabled="isSubmitting" />
    <p v-if="isSubmitting" class="text-blue-600 animate-pulse">⏳ Processing...</p>
    <p v-if="formState.submitted && !isSubmitting" class="text-green-600">✓ Form submitted successfully!</p>
    <pre class="text-xs bg-gray-100 p-2 rounded">{{ formState }}</pre>
  </div>
</template>
