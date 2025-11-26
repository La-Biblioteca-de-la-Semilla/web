import { defineStore } from 'pinia'
import { type Seed } from '@/model/Seed'
import { type CreateSeedDto } from '@/dtos/seeds/CreateSeedDto'
import { useUsersStore } from '@/stores/users'
import type { UpdateSeedDto } from '@/dtos/seeds/UpdateSeedDto'
import { seedService } from '@/services/seedService'


export const useSeedStore = defineStore('seed', {
  state: () => ({
    seeds: [] as Seed[],
    isLoading: true,
    filters: {
      searchBar: '',
      tags: [],
      sowing: [] as number[],
      sentOn: '',
      family: null,
      have: false,
      want: false
    },
    order: {
      by: 'name',
      asc: 1
    }
  }),
  getters: {
    getSeeds(state): Seed[] {
      const userStore = useUsersStore()
      const user = userStore.user
      const { searchBar, tags, sentOn, sowing, family, have, want } = state.filters
      const searchUpper = searchBar.toUpperCase()
      const sortKey = state.order.by as keyof Seed | null
      const isAscending = state.order.asc

      return state.seeds
        .filter((seed) => {
          // Search bar filter
          if (searchBar && !(
            seed.name.toUpperCase().includes(searchUpper) ||
            seed.species.toUpperCase().includes(searchUpper)
          )) return false

          // Tags filter
          if (tags.length > 0 && !tags.every(tag => seed.tags.includes(tag))) return false

          // SentOn filter
          if (sentOn.length > 0 && !(
            (sentOn === 'N/A' && seed.sentOn === '') ||
            seed.sentOn === sentOn
          )) return false

          if (family && seed.family !== family) return false

          // User preferences filter
          if (user && (have || want) && !(
            (have && user.have.includes(seed.id)) ||
            (want && user.want.includes(seed.id))
          )) return false

          // Sowing filter
          return !(sowing.length > 0 && !sowing.some(value => seed.sow.includes(value)))

        })
        .sort((a, b) => {
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
    }
  },
  actions: {
    async fetch() {
      try {
        this.seeds = []
        this.isLoading = true
        const seedsData = await seedService.getSeeds()

        this.seeds = seedsData.map((data: Seed) => ({
          ...data,
          owner: data.owner,
          description: data.description ?? '',
          sow: data.sow ?? [],
          sentOn: data.sentOn ?? '',
          tags: [...(data.tags ?? [])].sort(),
          family: data.family ?? null,
          sfgOriginal: data.sfgOriginal ?? null,
          sfgMultisow: data.sfgMultisow ?? null,
          sfgClump: data.sfgClump ?? null,
          germinationMin: data.germinationMin ?? null
        }) as Seed)
      } catch (error) {
        console.error('Error fetching seeds:', error)
      } finally {
        this.isLoading = false
      }
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

        this.seeds.push(createdSeed)
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
        this.seeds[seedIndex] = seed

        return seed
      } catch (error) {
        return await Promise.reject(error)
      }

    },
    async delete(id: string) {
      try {
        await seedService.deleteSeed(id)
        const removeIndex = this.seeds.findIndex(seed => seed.id === id)
        if (removeIndex >= 0) {
          this.seeds.splice(removeIndex, 1)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    setSearchBarFilter(searchBar: string) {
      this.filters.searchBar = searchBar
    }
  }
})
