import { refDebounced } from '@vueuse/core'

const searchInput = shallowRef('')
const debouncedSearch = refDebounced(searchInput, 500)

type NrdbExpression = (operator: '<' | '>' | ':' | '!', value: string) => ((card: NrdbCard) => boolean) | undefined

// Helper function for numeric comparisons
const numericOperand = (
  getValue: (card: NrdbCard) => number | undefined,
) => (operator: '<' | '>' | ':' | '!', value: string) => (card: NrdbCard) => {
  const cardValue = getValue(card)
  if (cardValue === undefined) return false
  const number = Number(value)
  if (isNaN(number)) return false
  if (operator === '<') return cardValue < number
  if (operator === '>') return cardValue > number
  if (operator === ':') return cardValue === number
  if (operator === '!') return cardValue !== number
  return false
}

// Helper function for string comparisons
const stringOperand = (
  getValue: (card: NrdbCard) => string | undefined,
) => (operator: '<' | '>' | ':' | '!', value: string) => {
  // String operands only support : and ! operators
  if (operator === '<' || operator === '>') return undefined
  return (card: NrdbCard) => {
    const cardValue = getValue(card)
    if (cardValue === undefined) return false
    const searchValue = value.toLowerCase()
    const cardValueLower = cardValue.toLowerCase()
    if (operator === ':') return cardValueLower.includes(searchValue)
    if (operator === '!') return !cardValueLower.includes(searchValue)
    return false
  }
}

// Helper function for boolean comparisons
const booleanOperand = (
  getValue: (card: NrdbCard) => boolean | undefined,
) => (operator: '<' | '>' | ':' | '!', value: string) => {
  // Boolean operands only support : and ! operators
  if (operator === '<' || operator === '>') return undefined
  return (card: NrdbCard) => {
    const cardValue = getValue(card)
    if (cardValue === undefined) return false
    const boolValue = value.toLowerCase() === 'true' || value === '1'
    if (operator === ':') return cardValue === boolValue
    if (operator === '!') return cardValue !== boolValue
    return false
  }
}

const operands: Record<string, NrdbExpression> = {
  // g – advancement cost
  g: numericOperand(card => card.advancementCost),
  // v – agenda points
  v: numericOperand(card => card.agendaPoints),
  // l – base link
  l: numericOperand(card => card.baseLink),
  // o – cost
  o: numericOperand(card => card.cost),
  // a – flavor text
  a: stringOperand(card => card.flavor),
  // i – illustrator
  i: stringOperand(card => card.illustrator),
  // n – influence (faction cost)
  n: numericOperand(card => card.factionCost),
  // m – memory usage
  m: numericOperand(card => card.memoryCost),
  // y – quantity printed in set
  y: numericOperand(card => card.quantity),
  // e – set
  e: stringOperand(card => card.packCode),
  // d – side
  d: stringOperand(card => card.sideCode),
  // p – strength
  p: numericOperand(card => card.strength),
  // s – subtype
  s: stringOperand(card => card.keywords),
  // x – text
  x: stringOperand(card => card.strippedText),
  // h – trash cost
  h: numericOperand(card => card.trashCost),
  // t – type
  t: stringOperand(card => card.typeCode),
  // u – unique
  u: booleanOperand(card => card.uniqueness),
}

const expressions = computed<Array<((card: NrdbCard) => boolean)>>(() => {
  const matches = debouncedSearch.value.matchAll(/(?<operand>[\w]+)(?<operator>[:><!])("(?<quotedValue>[^"]+?)"|(?<unquotedValue>[^\s]+))/g)
  const iterator = matches.map((match) => {
    const operand = match.groups?.operand
    const operator = match.groups?.operator as '<' | '>' | ':' | '!'
    const value = match.groups?.quotedValue ?? match.groups?.unquotedValue

    if (operand === undefined || operator === undefined || value === undefined) {
      return undefined
    }

    const expressionFactory = operands[operand]
    if (!expressionFactory) return undefined

    const expression = expressionFactory(operator, value)
    return expression
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
