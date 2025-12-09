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
}

const transformCards = (data: any): NrdbCard[] => {
  const template = data['imageUrlTemplate']
  if (!template) {
    throw new Error('Image URL template not found')
  }
  return data.data.map((card: any) => {
    return {
      code: card.code,
      deckLimit: card.deck_limit,
      factionCode: card.faction_code,
      factionCost: card.faction_cost,
      packCode: card.pack_code,
      position: card.position,
      quantity: card.quantity,
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
    }
  })
}

export const useNrdbCards = () => {
  return useFetch('https://netrunnerdb.com/api/2.0/public/cards', { transform: transformCards })
}
