<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

// ===== BASIC COMPUTED: Depends on reactive data =====
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  console.log('Computing fullName...')
  return `${firstName.value} ${lastName.value}`
})

// ===== COMPUTED WITH DEPENDENCIES: Price with tax =====
const price = ref(100)
const taxRate = ref(0.08)

const totalWithTax = computed(() => {
  console.log('Computing totalWithTax...')
  return (price.value * (1 + taxRate.value)).toFixed(2)
})

// ===== REAL-WORLD EXAMPLE: User profile from route params =====
// Routes: /user/:id?name=John&role=admin
const route = useRoute()

const userId = computed(() => {
  return route.params.id || 'N/A'
})

const userName = computed(() => {
  return (route.query.name as string) || 'Guest'
})

const userRole = computed(() => {
  return (route.query.role as string) || 'User'
})

const userBadgeColor = computed(() => {
  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800',
  }
  return roleColors[userRole.value] || 'bg-gray-100 text-gray-800'
})
</script>

<template>
  <div class="space-y-6">
    <!-- ===== BASIC COMPUTED ===== -->
    <div class="space-y-2 p-4 border border-gray-300 rounded">
      <h3 class="font-semibold">Basic Computed (Full Name)</h3>
      <p class="text-sm text-gray-600">Change inputs to see computed value update automatically</p>

      <div class="flex gap-4">
        <input v-model="firstName" type="text" placeholder="First name"
          class="px-3 py-1 border border-gray-300 rounded" />
        <input v-model="lastName" type="text" placeholder="Last name"
          class="px-3 py-1 border border-gray-300 rounded" />
      </div>

      <p class="font-bold text-lg">Full Name: {{ fullName }}</p>
    </div>

    <!-- ===== COMPUTED WITH DEPENDENCIES ===== -->
    <div class="space-y-2 p-4 border border-gray-300 rounded">
      <h3 class="font-semibold">Computed with Multiple Dependencies (Price with Tax)</h3>
      <p class="text-sm text-gray-600">Change price or tax rate to see total update</p>

      <div class="flex gap-4">
        <div>
          <label class="text-sm">Price: ${{ price }}</label>
          <input v-model.number="price" type="range" min="0" max="1000" step="10"
            class="w-32" />
        </div>

        <div>
          <label class="text-sm">Tax Rate: {{ (taxRate * 100).toFixed(1) }}%</label>
          <input v-model.number="taxRate" type="range" min="0" max="0.25" step="0.01"
            class="w-32" />
        </div>
      </div>

      <p class="font-bold text-lg">Total with Tax: ${{ totalWithTax }}</p>
    </div>

    <!-- ===== REAL-WORLD EXAMPLE: Route Parameters ===== -->
    <div class="space-y-2 p-4 border border-gray-300 rounded bg-blue-50">
      <h3 class="font-semibold">Real-World: User Profile from Route</h3>
      <p class="text-sm text-gray-600">Try: /computed/123?name=Alice&role=admin</p>

      <div class="space-y-2">
        <p><span class="font-semibold">User ID:</span> {{ userId }}</p>
        <p><span class="font-semibold">Name:</span> {{ userName }}</p>
        <p><span class="font-semibold">Role:</span>
          <span :class="['px-3 py-1 rounded-full text-sm', userBadgeColor]">
            {{ userRole }}
          </span>
        </p>
      </div>

      <p class="text-xs text-gray-500 mt-4 bg-white p-2 rounded">
        💡 The user info above is computed from route params/query. Try navigating to different routes!
      </p>
    </div>
  </div>
</template>
