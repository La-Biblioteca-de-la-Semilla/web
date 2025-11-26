import type { BotanicalFamily, SquareFootType } from '@/model/Seed'

export type SuggestionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export type Suggestion = {
  id: string
  seedId: string
  organizationId: string
  userId: string
  name: string | null
  species: string | null
  image: string | null
  description: string | null
  sow: number[] | null
  sentOn: string | null
  tags: string[] | null
  family: BotanicalFamily | null,
  sfgOriginal: SquareFootType | null
  sfgMultisow: SquareFootType | null
  sfgClump: SquareFootType | null
  germinationMin: number | null
  germinationMax: number | null
  status: SuggestionStatus
  createdAt: Date
  updatedAt: Date
}
