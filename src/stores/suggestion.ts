import { defineStore } from 'pinia'
import { type Suggestion } from '@/model/Suggestion'
import type { CreateSuggestionDto } from '@/dtos/suggestions/CreateSuggestionDto'
import { suggestionService } from '@/services/suggestionService'
import type { Pagination } from '@/stores/seedImages'


export const useSuggestionStore = defineStore('suggestion', {
  state: () => ({
    suggestions: [] as Suggestion[],
    suggestionsPagination: {} as Pagination
  }),
  getters: {
    pendingSuggestions(): Suggestion[] {
      return this.suggestions.filter((suggestion: Suggestion) => suggestion.status === 'PENDING')
    }
  },
  actions: {
    async fetch(): Promise<void> {
      try {
        const result = await suggestionService.listSuggestions()
        this.suggestions = result.suggestions
        this.suggestionsPagination = result.pagination
      } catch (reason) {
        return await Promise.reject(reason)
      }
    },
    async create(newSuggestion: Suggestion): Promise<Suggestion> {
      try {
        const { seedId, organizationId, userId, ...suggestionData } = newSuggestion

        const suggestionDto: CreateSuggestionDto = {
          seedId: seedId,
          organizationId: organizationId,
          userId: userId,
          ...suggestionData
        }

        const createdSuggestion = await suggestionService.createSuggestion(suggestionDto)

        this.suggestions.push(createdSuggestion)
        return createdSuggestion
      } catch (reason) {
        return await Promise.reject(reason)
      }
    },
    async accept(suggestion: Suggestion): Promise<void> {
      try {
        await suggestionService.acceptSuggestion(suggestion.id)
      } catch (reason) {
        return await Promise.reject(reason)
      }
    },
    async reject(suggestion: Suggestion): Promise<void> {
      try {
        await suggestionService.rejectSuggestion(suggestion.id)
      } catch (reason) {
        return await Promise.reject(reason)
      }
    }
  }
})
