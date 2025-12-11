export interface NrdbCard {
  code: string
  deckLimit: number
  factionCode: string
  factionCost: number
  packCode: string
  position: number
  quantity: number
  sideCode: string
  strippedTitle: string
  title: string
  typeCode: string
  uniqueness: boolean
  flavor?: string
  influenceLimit?: number
  keywords?: string
  minimumDeckSize?: number
  illustrator?: string
  strippedText?: string
  text?: string
  imageUrl?: string
  baseLink?: number
  cost?: number
  memoryCost?: number
  strength?: number
  advancementCost?: number
  agendaPoints?: number
  trashCost?: number
}

const transformCards = (data: any): NrdbCard[] => {
  const template = data['imageUrlTemplate']
  if (!template) {
    throw new Error('Image URL template not found')
  }
  return data.data.map((card: any) => {
    return {
      code: card.code,
      deckLimit: card.deck_limit ? Number(card.deck_limit) : undefined,
      factionCode: card.faction_code,
      factionCost: card.faction_cost ? Number(card.faction_cost) : undefined,
      packCode: card.pack_code,
      position: card.position ? Number(card.position) : undefined,
      quantity: card.quantity ? Number(card.quantity) : undefined,
      sideCode: card.side_code,
      strippedTitle: card.stripped_title,
      title: card.title,
      typeCode: card.type_code,
      uniqueness: card.uniqueness,
      flavor: card.flavor,
      influenceLimit: card.influence_limit,
      keywords: card.keywords,
      minimumDeckSize: card.minimum_deck_size,
      illustrator: card.illustrator,
      strippedText: card.stripped_text,
      text: card.text,
      imageUrl: template.replace('{code}', card.code),
      baseLink: card.base_link ? Number(card.base_link) : undefined,
      cost: card.cost ? Number(card.cost) : undefined,
      memoryCost: card.memory_cost ? Number(card.memory_cost) : undefined,
      strength: card.strength ? Number(card.strength) : undefined,
      advancementCost: card.advancement_cost ? Number(card.advancement_cost) : undefined,
      agendaPoints: card.agenda_points ? Number(card.agenda_points) : undefined,
      trashCost: card.trash_cost ? Number(card.trash_cost) : undefined,
    }
  })
}

export const useNrdbCards = () => {
  return useFetch('https://netrunnerdb.com/api/2.0/public/cards', { transform: transformCards })
}
