import api from './api'
import type { Seed } from '@/model/Seed'
import type { CreateSeedDto } from '@/dtos/seeds/CreateSeedDto'
import type { UpdateSeedDto } from '@/dtos/seeds/UpdateSeedDto'

export interface SeedsQueryParams {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  sentOn?: string
  family?: string
  sowing?: number[]
  draft?: boolean
  userHaveIds?: string[]
  userWantIds?: string[]
}

export interface SeedsResponse {
  seeds: Seed[]
  total: number
  page: number
  limit: number
}

export const seedService = {
  async getSeeds(params: SeedsQueryParams = {}): Promise<SeedsResponse> {
    const response = await api.get('/seeds', { params })
    return response.data
  },

  async publishSeed(id: string): Promise<void> {
    await api.post(`/seeds/${id}/publish`)
  },

  async createSeed(seedDto: CreateSeedDto): Promise<Seed> {
    const response = await api.post('/seeds', seedDto)
    return response.data
  },

  async updateSeed(id: string, seedDto: UpdateSeedDto): Promise<void> {
    await api.put(`/seeds/${id}`, seedDto)
  },

  async deleteSeed(id: string): Promise<void> {
    await api.delete(`/seeds/${id}`)
  }
}
