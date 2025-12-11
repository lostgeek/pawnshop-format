<template>
  <UContainer class="pt-8">
    <div
      class="
        flex gap-8
        max-md:flex-col
      "
    >
      <div
        class="
          grow basis-2/3
          max-md:order-2
        "
        :style="{ '--card-height': `${cardHeight}px` }"
      >
        <div class="mb-4 flex gap-2">
          <span>Card size</span>
          <UButton
            icon="i-lucide-plus"
            size="xs"
            color="primary"
            variant="solid"
            @click="cardHeight *= 1.1"
          />
          <UButton
            icon="i-lucide-minus"
            size="xs"
            color="primary"
            variant="solid"
            @click="cardHeight /= 1.1"
          />
        </div>
        <ul
          class="
            grid
            grid-cols-[repeat(auto-fill,minmax(calc(var(--card-height)/88*63),1fr))]
            place-items-center gap-2
            md:gap-4
          "
        >
          <li
            v-for="card in filteredCards"
            :key="card.code"
          >
            <div
              role="button"
              tabindex="0"
              class="
                group relative w-fit rounded-md
                before:pointer-events-none before:absolute before:inset-0
                before:rounded-md before:bg-black/25 before:opacity-0
                before:transition-opacity before:duration-100
                before:content-['']
                hover-focus:before:pointer-events-auto
                hover-focus:before:opacity-100
              "

              :class="{ 'shadow-xl shadow-primary/50 outline-4 outline-primary': selectedCards.some(c => c.code === card.code) }"
              @click="markCard(card)"
              @keydown.space.prevent="markCard(card)"
              @keydown.enter.prevent="markCard(card)"
            >
              <NrdbCard
                :card="card"
                class="h-(--card-height) transition-[height] duration-200"
              />
              <div
                class="
                  pointer-events-none absolute top-1 right-1 z-10 flex size-5
                  items-center justify-center rounded-full bg-red-600 opacity-0
                  transition-opacity duration-100
                  group-hover-focus:pointer-events-auto
                  group-hover-focus:opacity-100
                "
              >
                <UButton
                  icon="i-lucide-x-circle"
                  size="xs"
                  color="error"
                  variant="solid"
                  @click="deleteCard(card)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="
          flex min-w-0 grow basis-1/3 flex-col gap-4 overflow-hidden
          transition-[flex-basis] duration-500 ease-out
          max-md:order-1
        "
        :class="{ 'md:grow-0! md:basis-0!': !menuOpen }"
      >
        <div class="text-sm">
          Select a preset
          <div class="mt-1 flex gap-2">
            <UButton
              icon="i-heroicons-home-modern"
              label="Corp"
              color="primary"
              variant="solid"
              @click="selectPreset('corp')"
            />
            <UButton
              icon="i-heroicons-user"
              label="Runner"
              color="primary"
              variant="solid"
              @click="selectPreset('runner')"
            />
          </div>
        </div>
        <div class="flex min-w-40 flex-col gap-4">
          <UFormField
            label="Card pool"
          >
            <UTextarea
              v-model="inputList"
              :rows="20"
              class="w-full"
              placeholder="Copy your list from NRDB here (in jinteki.net format)"
            />
          </UFormField>
          <UFormField
            label="Your selected cards"
          >
            <UTextarea
              v-model="outputList"
              class="w-full"
              readonly
              :rows="20"
            />
          </UFormField>
          <div class="max-md:hidden">
            <UButton
              icon="i-lucide-eye-off"
              color="primary"
              variant="solid"
              label="Hide menu"
              @click="menuOpen = !menuOpen"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="
        fixed inset-y-0 right-0 flex flex-col justify-center
        transition-transform duration-500 ease-out
        max-md:hidden
        2xl:-translate-x-4
      "
      :class="{
        'rotate-y-180 max-xl:translate-x-full!': menuOpen ,
      }"
    >
      <UButton
        icon="i-lucide-chevron-left"
        size="lg"
        color="neutral"
        variant="soft"
        class="rounded-full"
        @click="menuOpen = !menuOpen"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { data } = await useNrdbCards()

const cardHeight = ref(196)

const menuOpen = ref(true)

const inputList = ref('')
const selectedCards = ref<NrdbCard[]>([])
const outputList = computed(() => {
  return selectedCards.value.map(c => `1 ${c.strippedTitle}`).join('\n')
})
const presets = useFormatPresets()

const selectPreset = (preset: 'runner' | 'corp') => {
  inputList.value = presets[preset]
}

const { debouncedSearch, filterCards } = useSearch()
const cards = computed(() => {
  return inputList.value.split('\n').map((text) => {
    const cardName = text.split(' ').slice(1)
      .join(' ')
    return data.value?.find(c => c.title === cardName || c.strippedTitle === cardName)
  })
    .filter(x => x !== undefined)
})

const filteredCards = computed(() => {
  if (debouncedSearch.value.length > 0) {
    return filterCards(cards.value)
  } else {
    return cards.value
  }
})

const markCard = (card: NrdbCard) => {
  if (selectedCards.value.some(c => c.code === card.code)) {
    selectedCards.value = selectedCards.value.filter(c => c.code !== card.code)
    return
  }
  selectedCards.value.push(card)
}

const deleteCard = (card: NrdbCard) => {
  inputList.value = inputList.value.split('\n').filter((text) => {
    const cardName = text.split(' ').slice(1)
      .join(' ')
    return card.title !== cardName && card.strippedTitle !== cardName
  })
    .join('\n')

  selectedCards.value = selectedCards.value.filter(c => c.code !== card.code)
}
</script>
