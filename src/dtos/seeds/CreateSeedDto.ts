import type {BotanicalFamily, SquareFootType} from "@/model/Seed";

export type CreateSeedDto = {
    name: string
    species: string
    image: string
    owner: string
    description: string
    sow: number[]
    sentOn: string
    tags: string[]
    family: BotanicalFamily | null
    sfgOriginal: SquareFootType | null
    sfgMultisow: SquareFootType | null
    sfgClump: SquareFootType | null
    germinationMin: number | null
    germinationMax: number | null
}
