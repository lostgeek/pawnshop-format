import { refDebounced } from '@vueuse/core'

const searchInput = shallowRef('')
const debouncedSearch = refDebounced(searchInput, 500)

type NrdbExpression = (operator: '<' | '>' | ':' | '!', value: string) => ((card: NrdbCard) => boolean)

const operands: Record<string, NrdbExpression> = {
  o: (operator, value) => (card) => {
    if (!card.cost) return false
    const number = Number(value)
    if (operator === '<') return card.cost < number
    if (operator === '>') return card.cost > number
    if (operator === ':') return card.cost === number
    if (operator === '!') return card.cost !== number
    return false
  },
}

const expressions = computed<Array<((card: NrdbCard) => boolean)>>(() => {
  const matches = debouncedSearch.value.matchAll(/(?<operand>[\w]+)(?<operator>[:><!])("(?<value>[^"]+?)"|(?<value>[^\s]+))/g)
  const iterator = matches.map((match) => {
    const operand = match.groups?.operand
    const operator = match.groups?.operator as '<' | '>' | ':' | '!'
    const value = match.groups?.value

    if (operand === undefined || operator === undefined || value === undefined) {
      return undefined
    }

    return operands[operand]?.(operator, value)
  })
  return Array.from(iterator.filter(x => x !== undefined))
})

const filterCards = (cards: NrdbCard[]) => {
  return cards.filter(card => expressions.value.every(expression => expression(card)))
}

export const useSearch = () => {
  return {
    searchInput,
    debouncedSearch,

    filterCards,
  }
}
