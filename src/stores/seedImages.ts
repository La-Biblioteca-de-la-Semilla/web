import { defineStore } from 'pinia'
import type { SeedImage } from '@/model/SeedImage'
import type { CreateImageDto } from '@/dtos/seedImages/CreateImageDto'
import { imageService } from '@/services/imageService'

export type Pagination = {
  total: number,
  page: number,
  limit: number
}

export const useSeedImagesStore = defineStore('seedImages', {
  state: () => ({
    seedId: null as String | null,
    seedImages: [] as SeedImage[],
    seedImagesPagination: null as Pagination | null,
    images: [] as SeedImage[],
    loadingMore: false,
    imagesPagination: {
      total: 0,
      page: 0,
      limit: 12
    } as Pagination
  }),
  getters: {
    hasMoreImages(): boolean {
      const { total, page, limit } = this.imagesPagination
      return (page + 1) * limit < total
    }
  },
  actions: {
    async create(seedId: string, image: string) {
      try {
        const createImageDto: CreateImageDto = {
          src: image,
          seedId: seedId
        }

        const createdImage = await imageService.createImage(createImageDto)

        this.images.push(createdImage)
        this.seedImages.push(createdImage)

      } catch (reason) {
        return await Promise.reject(reason)
      }
    },
    async fetchBySeedId(seedId: string) {
      try {
        this.seedId = seedId
        const result = await imageService.listImages({ seedId: seedId })
        this.seedImages = result.images
        this.seedImagesPagination = result.pagination

      } catch (reason) {
        return await Promise.reject(reason)
      }
    },
    resetGallery() {
      this.images = []
      this.imagesPagination = { total: 0, page: -1, limit: 12 }
      this.loadingMore = false
    },
    async fetchNext() {
      try {
        if (this.imagesPagination.page >= 0 && !this.hasMoreImages) return
        this.loadingMore = true
        const result = await imageService.listImages({
          page: this.imagesPagination.page + 1,
          limit: this.imagesPagination.limit
        })
        this.images = this.images.concat(result.images)
        this.imagesPagination = result.pagination
      } catch (reason) {
        return await Promise.reject(reason)
      } finally {
        this.loadingMore = false
      }
    }
  }
})
