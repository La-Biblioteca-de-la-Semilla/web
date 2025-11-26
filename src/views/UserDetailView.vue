<script setup lang="ts">

import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/users'
import { useSeedStore } from '@/stores/seed'
import { useChatsStore } from '@/stores/chats'
import type { User } from '@/model/User'
import type { Seed } from '@/model/Seed'

const route = useRoute()
const router = useRouter()

const usersStore = useUsersStore()
const seedStore = useSeedStore()
const chatStore = useChatsStore()

const { user: currentUser } = storeToRefs(usersStore)
const { seeds } = storeToRefs(seedStore)
const { chat } = storeToRefs(chatStore)

chatStore.fetch()

const user: Ref<User | null> = ref(null)
usersStore.getUserById(route.params.id as string).then((value) => user.value = value)

const have: ComputedRef<Seed[]> = computed(() => {
  if (!user.value) return []
  const resultIndex = Object.fromEntries(seeds.value.map(item => [item.id, item]))
  const haveSet = new Set(currentUser.value?.have)

  return user.value.have
    .map(seedId => resultIndex[seedId])
    .filter(Boolean)
    .sort((a, b) => {
      const inHaveA = haveSet.has(a.id)
      const inHaveB = haveSet.has(b.id)
      if (inHaveA && !inHaveB) return -1
      if (!inHaveA && inHaveB) return 1
      return 0
    })
})

const want: ComputedRef<Seed[]> = computed(() => {
  if (!user.value) return []
  const resultIndex = Object.fromEntries(seeds.value.map(item => [item.id, item]))
  const haveSet = new Set(currentUser.value?.have)

  return user.value.want
    .map(seedId => resultIndex[seedId])
    .filter(Boolean)
    .sort((a, b) => {
      const inHaveA = haveSet.has(a.id)
      const inHaveB = haveSet.has(b.id)
      if (inHaveA && !inHaveB) return -1
      if (!inHaveA && inHaveB) return 1
      return 0
    })
})

const onCreateChat = () => {
  if (!user.value) return
  chatStore.create({
    participants: [user.value.id]
  })
  router.push({ name: 'user-chat', params: { id: user.value.id } })
}

</script>

<template>
  <div class="container" v-if="user">
    <div class="row pt-5">
      <div class="col-md-3">
        <img v-bind:src="user.image" class="img-fluid user-img" alt="..." />
      </div>
      <div class="col-md-9">
        <div class="btn-group float-end">
          <RouterLink class="btn btn-primary" :to="{name: 'user-chat', params:{id: user.id}}" v-if="chat">
            <i class="bi bi-chat" /> Abrir chat
          </RouterLink>
          <button class="btn btn-primary" v-else @click="onCreateChat">
            <i class="bi bi-chat" /> Iniciar chat
          </button>
        </div>

        <h1>{{ user.name }}</h1>
      </div>
    </div>
    <div class="row mt-5 text-center">
      <div class="col-md-6">
        <i class="bi bi-arrow-left-square-fill text-primary" /> {{ user.name }} la tiene y tú la quieres
      </div>
      <div class="col-md-6">
        <i class="bi bi-arrow-right-square-fill text-success" /> Tú la tienes y {{ user.name }} la quiere
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Tiene
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="seed in have" :key="seed.id">
              {{ seed.name }}
              <i v-if="currentUser?.want.includes(seed.id)"
                 class="bi bi-arrow-left-square-fill text-primary float-end" />
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-6 mt-md-0 mt-5">
        <div class="card">
          <div class="card-header">
            Quiere
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="seed in want" :key="seed.id">
              {{ seed.name }}
              <i v-if="currentUser?.have.includes(seed.id)"
                 class="bi bi-arrow-right-square-fill text-success float-end" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-img {
  width: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .user-img {
    width: 100%;
    height: 30vh;
    object-fit: cover;
  }
}
</style>