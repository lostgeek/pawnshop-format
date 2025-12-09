<template>
  <UContainer class="pt-8">
    <div class="grid grid-cols-12 gap-4">
      <ul
        class="
          col-span-8 grid
          grid-cols-[repeat(auto-fill,minmax(calc(var(--card-height)/88*63),1fr))]
          place-items-center gap-4
          max-md:order-2 max-md:col-span-12
        "
        :style="{ '--card-height': `${cardHeight}px` }"
      >
        <li
          v-for="card in cards"
          :key="card.code"
        >
          <div
            role="button"
            tabindex="0"
            class="
              group relative w-fit rounded-md
              before:pointer-events-none before:absolute before:inset-0
              before:rounded-md before:bg-black/25 before:opacity-0
              before:transition-opacity before:duration-100 before:content-['']
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
      <div
        class="
          col-span-4 flex flex-col gap-4
          max-md:order-1 max-md:col-span-12
        "
      >
        <div class="flex gap-2">
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
        <UFormField
          label="Card pool"
        >
          <UTextarea
            v-model="inputList"
            :rows="20"
            class="w-full"
            placeholder="Copy your list from NRDB here"
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
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { data } = await useNrdbCards()

const cardHeight = ref(196)

const inputList = ref('')
const selectedCards = ref<NrdbCard[]>([])
const outputList = computed(() => {
  return selectedCards.value.map(c => `1 ${c.strippedTitle}`).join('\n')
})

const cards = computed(() => {
  return inputList.value.split('\n').map((text) => {
    const cardName = text.split(' ').slice(1)
      .join(' ')
    return data.value?.find(c => c.title === cardName || c.strippedTitle === cardName)
  })
    .filter(x => x !== undefined)
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
