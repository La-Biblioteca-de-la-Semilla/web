import { defineStore } from 'pinia'
import { watch } from 'vue'
import { type Seed } from '@/model/Seed'
import { type CreateSeedDto } from '@/dtos/seeds/CreateSeedDto'
import { useUsersStore } from '@/stores/users'
import type { UpdateSeedDto } from '@/dtos/seeds/UpdateSeedDto'
import { seedService } from '@/services/seedService'

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

export const useSeedStore = defineStore('seed', {
  state: () => ({
    seeds: [] as Seed[],
    isLoading: true,
    isLoadingMore: false,
    currentPage: 1,
    totalSeeds: 0,
    pageSize: 20,
    filters: {
      searchBar: '',
      tags: [] as string[],
      sowing: [] as number[],
      sentOn: '',
      family: null as string | null,
      have: false,
      want: false,
      draft: false
    },
    order: {
      by: 'name',
      asc: 1
    }
  }),
  getters: {
    getSeeds(state): Seed[] {
      const sortKey = state.order.by as keyof Seed | null
      const isAscending = state.order.asc

      return [...state.seeds].sort((a, b) => {
        if (!sortKey) return 0
        const valueA = a[sortKey]?.toString() || ''
        const valueB = b[sortKey]?.toString() || ''
        return isAscending * valueA.localeCompare(valueB)
      })
    },
    getSeedByName: (state) => {
      return (name: string) => state.seeds.find((seed) => seed.name === name)
    },
    getSentOnValues: (state) => {
      return state.seeds.reduce((acc, value) => {
        if (value.sentOn !== '' && !acc.includes(value.sentOn)) acc.push(value.sentOn)
        return acc
      }, [] as String[]).sort()
    },
    totalPages(state): number {
      return Math.ceil(state.totalSeeds / state.pageSize)
    }
  },
  actions: {
    async fetchSeeds() {
      try {
        this.isLoading = true
        const userStore = useUsersStore()
        const user = userStore.user
        const { searchBar, tags, sentOn, sowing, family, have, want, draft } = this.filters

        const params: import('@/services/seedService').SeedsQueryParams = {
          page: this.currentPage,
          limit: this.pageSize
        }

        if (searchBar) params.search = searchBar
        if (tags.length > 0) params.tags = tags
        if (sentOn) params.sentOn = sentOn
        if (family) params.family = family
        if (sowing.length > 0) params.sowing = sowing
        if (draft) params.draft = true
        if (user && have) params.userHaveIds = user.have
        if (user && want) params.userWantIds = user.want

        const response = await seedService.getSeeds(params)

        this.seeds = response.seeds.map((data: Seed) => ({
          ...data,
          description: data.description ?? '',
          sow: data.sow ?? [],
          sentOn: data.sentOn ?? '',
          tags: [...(data.tags ?? [])].sort(),
          family: data.family ?? null,
          sfgOriginal: data.sfgOriginal ?? null,
          sfgMultisow: data.sfgMultisow ?? null,
          sfgClump: data.sfgClump ?? null,
          germinationMin: data.germinationMin ?? null,
          status: data.status ?? 'published'
        }) as Seed)

        this.totalSeeds = response.total
        this.currentPage = response.page
      } catch (error) {
        console.error('Error fetching seeds:', error)
      } finally {
        this.isLoading = false
      }
    },

    async loadNextPage() {
      if (this.currentPage >= this.totalPages || this.isLoading || this.isLoadingMore) return
      this.currentPage += 1
      try {
        this.isLoadingMore = true
        const userStore = useUsersStore()
        const user = userStore.user
        const { searchBar, tags, sentOn, sowing, family, have, want, draft } = this.filters

        const params: import('@/services/seedService').SeedsQueryParams = {
          page: this.currentPage,
          limit: this.pageSize
        }

        if (searchBar) params.search = searchBar
        if (tags.length > 0) params.tags = tags
        if (sentOn) params.sentOn = sentOn
        if (family) params.family = family
        if (sowing.length > 0) params.sowing = sowing
        if (draft) params.draft = true
        if (user && have) params.userHaveIds = user.have
        if (user && want) params.userWantIds = user.want

        const response = await seedService.getSeeds(params)

        const mapped = response.seeds.map((data: Seed) => ({
          ...data,
          description: data.description ?? '',
          sow: data.sow ?? [],
          sentOn: data.sentOn ?? '',
          tags: [...(data.tags ?? [])].sort(),
          family: data.family ?? null,
          sfgOriginal: data.sfgOriginal ?? null,
          sfgMultisow: data.sfgMultisow ?? null,
          sfgClump: data.sfgClump ?? null,
          germinationMin: data.germinationMin ?? null,
          status: data.status ?? 'published'
        }) as Seed)

        this.seeds = [...this.seeds, ...mapped]
        this.totalSeeds = response.total
        this.currentPage = response.page
      } catch (error) {
        console.error('Error loading next page:', error)
        this.currentPage -= 1
      } finally {
        this.isLoadingMore = false
      }
    },

    async resetAndFetch() {
      this.currentPage = 1
      await this.fetchSeeds()
    },

    setupFilterWatchers() {
      watch(
        () => this.filters.searchBar,
        (newValue) => {
          if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
          if (newValue.length > 0 && newValue.length < 3) return
          searchDebounceTimer = setTimeout(() => {
            this.resetAndFetch()
          }, 1000)
        }
      )

      watch(
        () => ({
          tags: [...this.filters.tags],
          sowing: [...this.filters.sowing],
          sentOn: this.filters.sentOn,
          family: this.filters.family,
          have: this.filters.have,
          want: this.filters.want,
          draft: this.filters.draft
        }),
        () => {
          this.resetAndFetch()
        },
        { deep: true }
      )
    },

    async create(newSeed: Seed) {
      try {
        const seedDto: CreateSeedDto = {
          name: newSeed.name,
          species: newSeed.species,
          image: newSeed.image,
          owner: newSeed.owner,
          description: newSeed.description,
          sow: newSeed.sow,
          sentOn: newSeed.sentOn,
          tags: newSeed.tags,
          family: newSeed.family ?? null,
          sfgOriginal: newSeed.sfgOriginal ?? null,
          sfgMultisow: newSeed.sfgMultisow ?? null,
          sfgClump: newSeed.sfgClump ?? null,
          germinationMin: newSeed.germinationMin ?? null,
          germinationMax: newSeed.germinationMax ?? null
        }

        const createdSeed = await seedService.createSeed(seedDto)
        await this.resetAndFetch()
        return createdSeed
      } catch (reason) {
        return await Promise.reject(reason)
      }
    },

    async update(seed: Seed): Promise<Seed> {
      try {
        const updateSeedDto: UpdateSeedDto = {
          name: seed.name,
          species: seed.species,
          image: seed.image,
          description: seed.description,
          sow: seed.sow,
          sentOn: seed.sentOn,
          tags: seed.tags,
          family: seed.family ?? null,
          sfgOriginal: seed.sfgOriginal ?? null,
          sfgMultisow: seed.sfgMultisow ?? null,
          sfgClump: seed.sfgClump ?? null,
          germinationMin: seed.germinationMin ?? null,
          germinationMax: seed.germinationMax ?? null
        }

        await seedService.updateSeed(seed.id, updateSeedDto)

        const seedIndex = this.seeds.findIndex(s => s.id === seed.id)
        if (seedIndex >= 0) this.seeds[seedIndex] = seed

        return seed
      } catch (error) {
        return await Promise.reject(error)
      }
    },

    async delete(id: string) {
      try {
        await seedService.deleteSeed(id)
        await this.resetAndFetch()
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async publish(id: string) {
      try {
        await seedService.publishSeed(id)
        const seed = this.seeds.find(s => s.id === id)
        if (seed) seed.status = 'published'
      } catch (error) {
        return Promise.reject(error)
      }
    },

    setSearchBarFilter(searchBar: string) {
      this.filters.searchBar = searchBar
    }
  }
})
