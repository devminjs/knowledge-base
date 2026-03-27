<script setup lang="ts">
import { ref } from 'vue'

// Class bindings
const isActive = ref(false)
const isLarge = ref(false)
const class1 = ref('text-sm')
const class2 = ref('font-bold')

// Style bindings
const color = ref('red')
const size = ref(16)
const style1 = ref({ color: 'blue', fontSize: '18px' })
const style2 = ref({ fontWeight: 'bold', textDecoration: 'underline' })
</script>

<template>
  <div class="space-y-8">
    <!-- Class Binding Section -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold">Class Binding</h2>

      <!-- Object Syntax -->
      <div class="p-4 border border-gray-300 rounded">
        <h3 class="font-semibold mb-2">Object Syntax</h3>
        <p class="text-sm text-gray-600 mb-3">Pass object with class names as keys, conditions as values</p>

        <div
          :class="{ active: isActive, 'text-lg': isLarge }"
          class="px-4 py-2 border rounded mb-3"
        >
          Class binding with object
        </div>

        <div class="flex gap-2 mb-3">
          <button
            @click="isActive = !isActive"
            class="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Toggle active: {{ isActive }}
          </button>
          <button
            @click="isLarge = !isLarge"
            class="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Toggle large: {{ isLarge }}
          </button>
        </div>

        <pre class="text-xs bg-gray-100 p-2 rounded overflow-auto">{{ `{ active: ${isActive}, 'text-lg': ${isLarge} }` }}</pre>
      </div>

      <!-- Array Syntax -->
      <div class="p-4 border border-gray-300 rounded">
        <h3 class="font-semibold mb-2">Array Syntax</h3>
        <p class="text-sm text-gray-600 mb-3">Pass array of class names (strings or computed)</p>

        <div :class="[class1, class2]" class="px-4 py-2 border rounded mb-3 bg-purple-100">
          Class binding with array
        </div>

        <div class="flex gap-2 mb-3">
          <select v-model="class1" class="px-3 py-1 border rounded text-sm">
            <option>text-sm</option>
            <option>text-base</option>
            <option>text-lg</option>
          </select>

          <select v-model="class2" class="px-3 py-1 border rounded text-sm">
            <option>font-normal</option>
            <option>font-bold</option>
            <option>font-light</option>
          </select>
        </div>

        <pre class="text-xs bg-gray-100 p-2 rounded overflow-auto">{{ `['${class1}', '${class2}']` }}</pre>
      </div>
    </div>

    <!-- Style Binding Section -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold">Style Binding</h2>

      <!-- Object Syntax -->
      <div class="p-4 border border-gray-300 rounded">
        <h3 class="font-semibold mb-2">Object Syntax</h3>
        <p class="text-sm text-gray-600 mb-3">Pass object with CSS properties in camelCase</p>

        <div
          :style="{ color: color, fontSize: size + 'px' }"
          class="px-4 py-2 border rounded mb-3"
        >
          Style binding with object
        </div>

        <div class="space-y-2 mb-3">
          <div>
            <label class="block text-sm font-medium mb-1">Color:</label>
            <select v-model="color" class="px-3 py-1 border rounded text-sm">
              <option>red</option>
              <option>blue</option>
              <option>green</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Size: {{ size }}px</label>
            <input v-model.number="size" type="range" min="12" max="32" class="w-full" />
          </div>
        </div>

        <pre class="text-xs bg-gray-100 p-2 rounded overflow-auto">{{ `{ color: '${color}', fontSize: '${size}px' }` }}</pre>
      </div>

      <!-- Array Syntax -->
      <div class="p-4 border border-gray-300 rounded">
        <h3 class="font-semibold mb-2">Array Syntax</h3>
        <p class="text-sm text-gray-600 mb-3">Pass array of style objects to merge multiple styles</p>

        <div :style="[style1, style2]" class="px-4 py-2 border rounded mb-3">
          Style binding with array
        </div>

        <div class="flex gap-2 mb-3">
          <button
            @click="style1 = { color: style1.color === 'blue' ? 'red' : 'blue', fontSize: '18px' }"
            class="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Toggle color
          </button>

          <button
            @click="style2 = { fontWeight: style2.fontWeight === 'bold' ? 'normal' : 'bold', textDecoration: style2.textDecoration }"
            class="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Toggle weight
          </button>
        </div>

        <pre class="text-xs bg-gray-100 p-2 rounded overflow-auto">{{ `[${JSON.stringify(style1)}, ${JSON.stringify(style2)}]` }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active {
  background-color: #dbeafe;
  border-color: #3b82f6;
}
</style>
