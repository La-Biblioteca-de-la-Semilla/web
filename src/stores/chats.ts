import { defineStore } from 'pinia'
import type { Chat } from '@/model/Chat'
import type { CreateChatDto } from '@/dtos/chats/CreateChatDto'
import { chatService } from '@/services/chatService'
import { messageService } from '@/services/messageService'
import { useUsersStore } from '@/stores/users'

export const useChatsStore = defineStore('chats', {
  state: () => ({
    chats: [] as Chat[],
    chatId: null as string | null,
    page: 1
  }),
  getters: {
    chat(): Chat | null {
      return this.chats.find((chat: Chat) => chat.id === this.chatId) || null
    },
    getUnread(state): Chat[] {
      const usersStore = useUsersStore()
      return state.chats.filter((chat: Chat) => chat.unreadBy.includes(usersStore.user?.id || ''))
    }
  },
  actions: {
    // Chats
    async fetch() {
      if (this.chats.length > 0) return
      this.chats = await chatService.getChats()
    },
    async create(createChatDto: CreateChatDto) {
      const result = await chatService.createChat(createChatDto)
      this.chats.push(result)
    },
    // Messages
    async sendMessage(chatId: string, text: string) {
      const result = await messageService.sendMessage(chatId, { text })
      const chat = this.chats.find((chat: Chat) => chat.id === chatId)
      if (!chat) return
      if (!Array.isArray(chat.messages)) chat.messages = []
      chat.messages = [result, ...chat.messages]
    },
    async loadMessagesByParticipant(participantId: string) {
      const chat = this.chats.find((chat: Chat) => chat.participants.includes(participantId))
      if (chat) {
        chat.messages = []
        await this.loadMessages(chat.id)
      }
    },
    async loadMessages(chatId: string, page: number = 1, limit: number = 10) {
      this.chatId = chatId
      this.page = page
      const result = await messageService.getMessages(chatId, page, limit)
      const chat = this.chats.find((chat: Chat) => chat.id === chatId)
      if (!chat) return
      if (!Array.isArray(chat.messages)) chat.messages = []
      chat.messages = chat.messages.concat(result)
    }
  }
})