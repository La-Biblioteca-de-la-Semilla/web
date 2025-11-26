import api from './api'
import type { Organization } from '@/model/Organization'

export const organizationService = {
  async getOrganizations(): Promise<Organization[]> {
    const response = await api.get('/organizations')
    return response.data.organizations
  }
}
