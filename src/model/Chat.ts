export type Chat = {
  id: string
  participants: string[],
  unreadBy: string []
  totalMessages: number,
  lastMessage: Message | null
  messages: Message[]
}

export type Message = {
  id: string
  from: string
  text: string
  sentAt: Date
}
