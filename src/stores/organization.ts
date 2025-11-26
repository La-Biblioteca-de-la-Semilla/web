import { defineStore } from 'pinia'
import { type Organization } from '@/model/Organization'
import { organizationService } from '@/services/organizationService'
import { useUsersStore } from '@/stores/users'

export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    organizations: [] as Organization[]
  }),
  getters: {
    userOrganizations(state): Organization[] {
      const usersStore = useUsersStore()
      return state.organizations.filter(o => o.owner === usersStore.user?.id)
    }
  },
  actions: {
    async fetch() {
      this.$reset()
      const organizationData = await organizationService.getOrganizations()

      this.organizations = organizationData.map((data: Organization) => {
        return {
          id: data.id,
          name: data.name,
          image: data.image,
          url: data.url,
          owner: data.owner
        }
      })
    }
  }
})
