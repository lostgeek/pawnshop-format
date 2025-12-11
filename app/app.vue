<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <UHeader
      title="Pawnshop Format"
      :ui="{
        container: 'relative',
        title: 'flex items-center gap-4 -translate-x-6',
        center: 'flex-0!',
        right: 'flex-2!',
      }"
    >
      <template #title>
        <NuxtImg
          src="/aesops.png"
          alt="Pawnshop Format"
          class="h-12"
        />
        <div>
          Pawnshop
        </div>
      </template>
      <template #right>
        <UInput
          v-model="searchInput"
          class="w-full"
          placeholder="Search cards (NRDB syntax)"
        />
        <UButton
          color="neutral"
          variant="ghost"
          to="https://netrunnerdb.com/en/syntax"
          trailing-icon="i-heroicons-arrow-top-right-on-square"
        >
          Syntax
        </UButton>
      </template>
    </UHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter />
  </UApp>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Pawnshop Formathelper',
  ogTitle: 'Pawnshop Formathelper',
  description: 'Helping tool for the Pawnshop Netruner format',
  ogDescription: 'Helping tool for the Pawnshop Netruner format',
  ogImage: 'https://pawnshop.gordianbla.de/aesops.png',
  twitterCard: 'summary_large_image',
})

const { searchInput } = useSearch()
</script>
