<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { useSuggestionStore } from '@/stores/suggestion'
import type { Suggestion } from '@/model/Suggestion'

const suggestionStore = useSuggestionStore()
const { pendingSuggestions } = storeToRefs(suggestionStore)

function getDiffNum(suggestion: Suggestion) {
  const { name, species, image, description, sow, sentOn, tags } = suggestion
  const a = { name, species, image, description, sow, sentOn, tags }
  return Object.values(a).filter(value => value !== null).length
}

</script>

<template>
  <div class="container pt-5">
    <h1>Sugerencias de cambio</h1>
    <ol class="list-group mt-4" v-if="pendingSuggestions">
      <li v-for="suggestion in pendingSuggestions" :key="suggestion.id"
          class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold">
            <RouterLink class="text-decoration-none" :to="{name: 'suggestion-detail', params:{id: suggestion.id}}">
              {{ suggestion.name }}
            </RouterLink>
          </div>
          <small class="text-muted">
            <i class="bi bi-bandaid" /> {{ getDiffNum(suggestion) }} cambios por {{ suggestion.userId }}
            <i class="bi bi-calendar-check ms-3" /> {{ suggestion.createdAt.toLocaleString() }}
          </small>
        </div>
        <span class="badge text-bg-secondary">{{ suggestion.status }}</span>
      </li>
    </ol>
    <h5 class="text-muted text-center mt-4">No hay sugerencias pendientes</h5>
  </div>
</template>

<style scoped>

</style>