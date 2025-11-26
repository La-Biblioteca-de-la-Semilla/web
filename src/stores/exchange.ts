import { defineStore } from 'pinia'
import { exchangeService } from '@/services/exchangeService'

interface MatchingUser {
  id: string;
  name: string;
  image: string;
  wantHaveMatches: number;
  haveWantMatches: number;
  totalMatches: number;
}

export const useExchangeStore = defineStore('exchange', {
  state: () => ({
    loading: false,
    matches: [] as MatchingUser[]
  }),
  actions: {
    async fetchMatchingUsers() {
      try {
        this.loading = true
        this.matches = await exchangeService.getExchangeUserList()
      } catch (error) {
        console.error('Error al obtener usuarios con coincidencias:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
