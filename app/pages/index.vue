<template>
  <h1 class="text-2xl font-bold">
    Hello World
  </h1>
  <div class="grid grid-cols-12">
    <ul
      class="
        col-span-8
        max-md:order-2 max-md:col-span-12
      "
    >
      <li>hello</li>
    </ul>
    <div
      class="
        col-span-4 flex flex-col gap-4
        max-md:order-1 max-md:col-span-12
      "
    >
      <textarea
        rows="20"
        placeholder="Enter your text here"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: cards } = await useNrdbCards()
</script>
