import api from '@/services/api'
import type { CreateChatDto } from '@/dtos/chats/CreateChatDto'
import type { Chat } from '@/model/Chat'

export const chatService = {
  async getChats(): Promise<Chat[]> {
    const response = await api.get('/chats')
    return response.data.chats.map(ChatAPIMapper.fromAPI)
  },
  async createChat(chatDto: CreateChatDto): Promise<Chat> {
    const response = await api.post('/chats', chatDto)
    return response.data
  }
}

class ChatAPIMapper {
  static fromAPI(response: any): Chat {
    return {
      id: response.id,
      participants: response.participants,
      unreadBy: response.unreadBy,
      totalMessages: response.totalMessages,
      lastMessage: {
        ...response.lastMessage,
        sentAt: new Date(response.lastMessage.sentAt)
      },
      messages: []
    }
  }
}