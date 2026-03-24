<script setup lang="ts">
import { ref } from 'vue'

// Data binding example
const msg = 'Hello from HomeView!'
const rawHtml = `
<span>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis error quidem modi doloremque quasi voluptates eligendi incidunt, eaque expedita vero harum? Perferendis dolorem dolorum, officia nisi voluptates ipsa tempore rerum?
</span>
`;

// Attributes example
const dynamicId = 'test-id'
const id = 'test-same-id'
const objectOfAttrs = {
  id: 'container',
  class: 'bg-green-200 w-full h-[50px] flex items-center justify-center text-green-900',
}
const src = "https://i.pinimg.com/736x/a4/2f/72/a42f72ce894c2bcabda52f164a05f481.jpg";

// Form example
const formInput = ref('')
const submittedValue = ref('')
const onSubmit = () => {
  submittedValue.value = formInput.value
  console.log('Form submitted with value:', formInput.value)
}
</script>

<template>
  <!-- Basic data binding -->
  <div class="flex flex-col gap-4">
    <div>
      <p>Message: {{ msg }}</p>
    </div>

    <!-- Set raw html -->
    <div class="flex flex-col gap-4 text-sm">
      <div>
        <p><b>Using text interpolation:</b></p>
        <p class="text-gray-500 text-xs">{{ rawHtml }}</p>
      </div>

      <div>
        <p><b>Using v-html directive:</b></p>
        <p class="text-red-400 text-xs">
          <span v-html="rawHtml"></span>
        </p>
      </div>
    </div>

    <!-- Attribute binding -->
    <div v-bind:id="dynamicId">Attribute binding - id</div>
    <div :id>Attribute binding - property name same as attr</div>
    <div v-bind="objectOfAttrs">
      Bind multiple properties together
    </div>

    <!-- shorthand usage -->
    <img :src alt="bike" class="w-[200px]">

    <!-- Modifiers -->

    <!-- Form example with @submit.prevent -->
    <div class="w-[500px] pt-4">
      <p><b>Form with @submit.prevent:</b></p>
      <form @submit.prevent="onSubmit" class="flex gap-2 mt-2">
        <input v-model="formInput" type="text" placeholder="Enter your name"
          class="px-3 py-1 border border-gray-300 rounded" />
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </form>

      <div v-if="submittedValue" class="mt-4 p-2 text-sm bg-green-100 border border-green-400 rounded">
        <p class="text-green-800"><b>Submitted value:</b> {{ submittedValue }}</p>
      </div>
    </div>
  </div>
</template>
