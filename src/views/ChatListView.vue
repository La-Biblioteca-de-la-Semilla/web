<script setup lang="ts">

import { useChatsStore } from '@/stores/chats'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import { useUsersStore } from '@/stores/users'
import type { Chat } from '@/model/Chat'

const userStore = useUsersStore()
const { users, user } = storeToRefs(userStore)

const chatsStore = useChatsStore()
const { chats } = storeToRefs(chatsStore)

const isUnread = (chat: Chat) => chat.unreadBy.includes(user.value?.id || '')

// Helper para obtener un usuario desde la cache local del store
const getUser = (uid: string) => users.value.find(u => u.id === uid)

// Helper para filtrar al usuario actual de una lista de ids
const withoutCurrent = (ids: string[]) => {
  const currentId = user.value?.id
  return currentId ? ids.filter(id => id !== currentId) : ids
}

// Cuando haya chats, precargamos todos los usuarios participantes
watch(
  chats,
  async (newChats) => {
    if (!newChats || newChats.length === 0) return
    const allIds = newChats.flatMap(c => c.participants)
    const uniqueIds = Array.from(new Set(allIds))
    await Promise.all(uniqueIds.map(id => userStore.getUserById(id)))
  },
  { immediate: true }
)

onMounted(async () => {
  if (!chats.value || chats.value.length === 0)
    await chatsStore.fetch()
})

</script>

<template>
  <div class="container pt-5">
    <h1>Chats</h1>
    <ul class="list-group" v-if="chats.length > 0">
      <li class="list-group-item" v-for="chat in chats" :key="chat.id">
        <RouterLink :to="{name: 'user-chat', params:{id: withoutCurrent(chat.participants)[0] || chat.participants[0]}}"
                    class="text-decoration-none text-reset">
          <div class="row">
            <div class="col-auto">
              <img
                v-for="u in withoutCurrent(chat.participants)"
                :key="u"
                class="img-fluid rounded-circle"
                :src="getUser(u)?.image || 'https://via.placeholder.com/50'"
                :alt="getUser(u)?.name || u"
                style="width: 50px" />
            </div>
            <div class="col">
              <span v-if="isUnread(chat)" class="badge ms-2 bg-primary p-2 rounded-circle float-end">
                  <span class="visually-hidden">Unread messages</span>
                </span>
              <small v-if="chat.lastMessage" class="float-end">
                <i v-if="chat.lastMessage.sentAt.toDateString() ===  new Date().toDateString()">
                  {{ chat.lastMessage.sentAt.toLocaleTimeString().substring(0, 5) }}
                </i>
                <i v-else>
                  {{ chat.lastMessage.sentAt.toLocaleDateString() }}
                </i>
              </small>
              <b v-for="u in withoutCurrent(chat.participants)" :key="u">
                {{ getUser(u)?.name || u }}
              </b>
              <br />
              <small class="text-muted" v-if="chat.lastMessage">
                {{ getUser(chat.lastMessage.from)?.name || chat.lastMessage.from }}: {{ chat.lastMessage.text }}
              </small>
              <small class="text-muted" v-else>No hay mensajes</small>
            </div>
          </div>
        </RouterLink>
      </li>
    </ul>
    <div v-else class="text-center mt-5">
      <p class="fs-4">No hay chats</p>
      <p class="text-muted "><i class="bi bi-exclamation-circle-fill" /> Prueba a contactar con alguien en
        <RouterLink :to="{name:'exchange'}">la zona de intercambio</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>