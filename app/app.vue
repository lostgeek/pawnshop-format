<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <UHeader
      title="Pawnshop Format"
      :ui="{ container: 'relative', title: 'flex items-center gap-4 -translate-x-6' }"
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
    </UHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter />
  </UApp>
</template>
