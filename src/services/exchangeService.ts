import api from '@/services/api'

export const exchangeService = {
  async getExchangeUserList() {
    const response = await api.get('/exchanges')
    return response.data
  }
}