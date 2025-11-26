import type {User} from "@/model/User";

export type SeedImage = {
    id: string
    src: string
    createdAt: Date
    createdBy: User
    seedId: string
}