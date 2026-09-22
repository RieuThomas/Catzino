interface CatUnlock {
  type: string
  value: number
  building?: string
  level?: number   
}

export interface Cat {
  id: string
  name: string
  rarity: string
  passive_income: number
  unlock: CatUnlock
  description: string
}