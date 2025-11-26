import api from '@/services/api'
import type { CreateMessageDto } from '@/dtos/chats/CreateMessageDto'
import type { Message } from '@/model/Chat'

export const messageService = {
  async sendMessage(chatId: string, messageDto: CreateMessageDto): Promise<Message> {
    const response = await api.post(`/chats/${chatId}/messages`, messageDto)
    return {
      ...response.data,
      sentAt: new Date(response.data.sentAt)
    }
  },
  async getMessages(chatId: string, page: number, limit: number): Promise<Message[]> {
    const response = await api.get(`/chats/${chatId}/messages?page=${page}&limit=${limit}`)
    return response.data.messages.map((message: any) => ({
      ...message,
      sentAt: new Date(message.sentAt)
    }))
  }
}

