import api from './api'
import type { Seed } from '@/model/Seed'
import type { CreateSeedDto } from '@/dtos/seeds/CreateSeedDto'
import type { UpdateSeedDto } from '@/dtos/seeds/UpdateSeedDto'

export const seedService = {
  async getSeeds(): Promise<Seed[]> {
    const response = await api.get('/seeds')
    return response.data.seeds
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
