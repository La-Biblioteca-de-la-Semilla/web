import type { CreateSuggestionDto } from '@/dtos/suggestions/CreateSuggestionDto'
import type { Suggestion } from '@/model/Suggestion'
import api from '@/services/api'

export const suggestionService = {

  async listSuggestions(): Promise<{
    suggestions: Suggestion[];
    pagination: { total: number; page: number; limit: number }
  }> {
    const response = await api.get('/suggestions')
    return response.data
  },

  async createSuggestion(suggestionDto: CreateSuggestionDto): Promise<Suggestion> {
    const response = await api.post('/suggestions', suggestionDto)
    return response.data
  },
  async acceptSuggestion(id: string) {
    const response = await api.post(`/suggestions/${id}/accept`)
    return response.data
  },
  async rejectSuggestion(id: string) {
    const response = await api.post(`/suggestions/${id}/reject`)
    return response.data
  }
}