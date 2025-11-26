import type {SquareFootType} from "@/model/Seed";

export type UpdateSeedDto = {
    name: string
    species: string
    image: string
    description: string
    sow: number[]
    sentOn: string
    tags: string[]
    family: string | null
    sfgOriginal: SquareFootType | null
    sfgMultisow: SquareFootType | null
    sfgClump: SquareFootType | null
    germinationMin: number | null
    germinationMax: number | null
}
