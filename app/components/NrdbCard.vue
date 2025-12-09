<template>
  <NuxtImg
    :src="card.imageUrl"
    :alt="card.title"
    class="rounded-md"
  />
</template>

<script setup lang="ts">
defineProps<{
  card: NrdbCard
}>()
</script>
