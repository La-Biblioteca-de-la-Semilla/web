<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { User } from '@/model/User'
import { useUsersStore } from '@/stores/users'
import { useChatsStore } from '@/stores/chats'

const route = useRoute()

const usersStore = useUsersStore()
const chatsStore = useChatsStore()
const { user } = storeToRefs(usersStore)
const { chat } = storeToRefs(chatsStore)

const participant = ref<User | null>(null)
const text = ref<string>('')


async function onSend() {
  if (chat.value && text.value.length > 0) {
    await chatsStore.sendMessage(chat.value.id, text.value)
    text.value = ''
  }
}

async function onOldMessages() {
  if (chat.value) {
    await chatsStore.loadMessages(chat.value.id, chatsStore.page + 1)
  }
}

onMounted(async () => {
  await chatsStore.fetch()
  await chatsStore.loadMessagesByParticipant(route.params.id as string)
  participant.value = await usersStore.getUserById(route.params.id as string)

})

</script>

<template>
  <div class="container">
    <div class="row pt-5 align-items-center" v-if="participant">
      <div class="col-auto">
        <img v-bind:src="participant.image" class="img-fluid" alt="..." style="height: 48px" />
      </div>
      <div class="col text-truncate ps-0">
        <p class="fs-4 text-truncate m-0">{{ participant.name }} </p>
      </div>
      <div class="col-auto">
        <div class="btn-group">
          <RouterLink class="btn btn-outline-secondary" :to="{name: 'user-detail', params:{id: participant.id}}">
            <i class="bi bi-person" /> Ver perfil
          </RouterLink>
        </div>
      </div>
    </div>
    <div id="chat-content" class="overflow-y-auto card pb-3" v-if="chat">
      <div class="row pt-4 m-0" v-for="m in chat.messages" :key="m.id">
        <div class="col">
          <div class="card"
               :class="{
                   'float-start text-bg-light me-5 text-start': m.from !== user?.id,
                   'float-end text-bg-primary ms-5 text-end': m.from === user?.id,
                 }">
            <div class="card-body py-0 pt-2">
              <p class="card-text m-0">{{ m.text }}</p>
              <i v-if="m.sentAt === new Date()"
                 class="float-end"
                 style="font-size: 0.7rem">
                {{ m.sentAt.toLocaleTimeString().substring(0, 5) }}
              </i>
              <i v-else
                 class="float-end"
                 style="font-size: 0.6rem">
                {{ m.sentAt.toLocaleDateString() }} {{ m.sentAt.toLocaleTimeString().substring(0, 5) }}
              </i>
            </div>
          </div>
        </div>
      </div>
      <div class="row pt-4 m-0" v-if="chat.messages.length < chat.totalMessages">
        <div class="col text-center">
          <button class="btn btn-light" @click.prevent="onOldMessages">
            <i class="bi bi-arrow-up" />
            Mensajes anteriores
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Escribe tu mensaje..."
                 aria-label="Escribe tu mensaje"
                 aria-describedby="send-message"
                 v-model="text"
                 @keydown.prevent.enter="onSend">
          <button class="btn btn-outline-primary" type="button" id="send-message" @click="onSend">
            <i class="bi bi-send" /> Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#chat-content {
  height: calc(100vh - 60px - 124px - 70px);
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}
</style>