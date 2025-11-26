import type {SquareFootType} from "@/model/Seed";

export type CreateSuggestionDto = {
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
    family: string | null
    sfgOriginal: SquareFootType | null
    sfgMultisow: SquareFootType | null
    sfgClump: SquareFootType | null
    germinationMin: number | null
    germinationMax: number | null
}

