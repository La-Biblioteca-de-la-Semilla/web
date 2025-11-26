<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useSeedStore } from '@/stores/seed'
import CookiesModal from '@/components/modals/CookiesModal.vue'
import { useUsersStore } from '@/stores/users'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import NotificationToasts from '@/components/NotificationToasts.vue'
import ReportsModal from '@/components/modals/ReportsModal.vue'
import { useOrganizationStore } from '@/stores/organization'
import { watch } from 'vue'
import { useSuggestionStore } from '@/stores/suggestion'


const userStore = useUsersStore()
const organizationStore = useOrganizationStore()
const seedStore = useSeedStore()
const suggestionStore = useSuggestionStore()

organizationStore.fetch()
seedStore.fetch()

watch(
  () => organizationStore.userOrganizations,
  (userOrganizations) => {
    if (userOrganizations.length > 0) {
      suggestionStore.fetch()
    }
  }
)

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (user) => {
        unsubscribe()
        if (user) userStore.fetchCurrentUser(user.uid)
        resolve(user)
      },
      reject
    )
  })
}
getCurrentUser()

</script>
<template>
  <AppHeader />
  <RouterView style="margin-top: 60px" class="mb-5" />
  <AppFooter />
  <CookiesModal />
  <NotificationToasts />
  <ReportsModal />
</template>

<style scoped></style>
