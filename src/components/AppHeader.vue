<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import LoginModal from '@/components/modals/LoginModal.vue'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { useSuggestionStore } from '@/stores/suggestion'
import { useOrganizationStore } from '@/stores/organization'
import { useChatsStore } from '@/stores/chats'

const router = useRouter()

const userStore = useUsersStore()
const { user } = storeToRefs(userStore)

const organizationStore = useOrganizationStore()
const { userOrganizations } = storeToRefs(organizationStore)

const suggestionStore = useSuggestionStore()
const { pendingSuggestions } = storeToRefs(suggestionStore)

const chatStore = useChatsStore()

const handleSignOut = () => {
  userStore.signOut().then(() => {
    router.push('/')
  }).catch(console.error)
}

</script>

<template>
  <header class="navbar fixed-top navbar-expand-lg bg-body-tertiary d-print-none">
    <div class="container">
      <RouterLink :to="{ name: 'home' }" class="navbar-brand">
        <img class="bi me-2" height="32" src="@/assets/logo.svg"
             alt="Logo de La biblioteca de la semilla. Un libro abierto con tres semillas saliendo de el." />
        <b class="navbar-brand-text">La Biblioteca de la Semilla</b>
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        <span class="badge bg-primary ms-2" v-if="chatStore.getUnread.length > 0">
                {{ chatStore.getUnread.length }}
              </span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto" v-if="user">
          <li class="nav-item me-lg-3 text-end">
            <RouterLink :to="{ name: 'exchange' }" class="nav-link">Intercambio</RouterLink>
          </li>
          <li class="nav-item me-lg-3 text-end">
            <RouterLink :to="{ name: 'chats' }" class="nav-link">
              Chats
              <span class="badge bg-primary ms-2" v-if="chatStore.getUnread.length > 0">
                {{ chatStore.getUnread.length }}
              </span>
            </RouterLink>
          </li>
          <li class="nav-item me-lg-3 text-end">
            <RouterLink :to="{ name: 'gallery' }" class="nav-link">La Galería</RouterLink>
          </li>
          <li class="nav-item text-end dropdown">
            <button class="btn btn-sm dropdown-toggle position-relative" data-bs-toggle="dropdown"
                    aria-expanded="false">
              <img :src="user.image" alt="your user profile photo" width="32" height="32" class="rounded-circle">
              <span
                v-if="userOrganizations.length > 0 && pendingSuggestions.length > 0"
                class="position-absolute top-0 end-0 badge p-2 bg-primary border border-light rounded-circle"
                style="transform: translate(-12px, 0%)">
                <span class="visually-hidden">action required</span>
              </span>
            </button>
            <ul class="dropdown-menu"
                style="position: absolute; inset: 0 0 auto auto; transform: translate(0px, 40px)">
              <li>
                <RouterLink
                  :to="{ name: 'profile' }"
                  class="dropdown-item">
                  <i class="bi bi-person" /> Editar perfil
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  v-if="userOrganizations.length > 0"
                  :to="{ name: 'suggestions' }"
                  class="dropdown-item">
                  <i class="bi bi-bandaid" /> Sugerencias de cambio
                  <span v-if="pendingSuggestions.length > 0" class="badge rounded-pill text-bg-primary mx-2"
                        style="transform: translate(0px, -2px)">{{ pendingSuggestions.length }}</span>
                </RouterLink>
              </li>
              <li class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item" @click="handleSignOut">
                  <i class="bi bi-arrow-bar-right" /> Cerrar sesión
                </button>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto" v-else>
          <li class="nav-item me-lg-2 text-end">
            <RouterLink :to="{ name: 'what-is-this' }" class="nav-link">¿Qué es?</RouterLink>
          </li>
          <li>
            <a class="nav-link btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#loginModal"><i
              class="bi bi-arrow-bar-right"></i> Iniciar sesión</a>
          </li>
        </ul>
      </div>
    </div>
  </header>

  <LoginModal></LoginModal>
</template>

<style scoped>
@media (max-width: 768px) {
  .navbar-brand-text {
    display: none;
  }
}
</style>
