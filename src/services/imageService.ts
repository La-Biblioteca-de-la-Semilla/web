import api from './api'
import type { SeedImage } from '@/model/SeedImage'
import type { CreateImageDto } from '@/dtos/seedImages/CreateImageDto'

export const imageService = {
  async listImages(params?: { page?: number; limit?: number; seedId?: string }): Promise<{
    images: SeedImage[];
    pagination: { total: number; page: number; limit: number }
  }> {
    const response = await api.get('/images', { params })
    return response.data
  },

  async createImage(data: CreateImageDto): Promise<SeedImage> {
    const response = await api.post('/images', data)
    return response.data
  },

  async deleteImage(imageId: string): Promise<void> {
    await api.delete(`/images/${encodeURIComponent(imageId)}`)
  }
}