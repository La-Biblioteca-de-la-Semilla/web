<script setup lang="ts">
import SeedForm, { type Button } from '@/components/SeedForm.vue'
import { useSeedStore } from '@/stores/seed'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type Seed } from '@/model/Seed'
import { useSuggestionStore } from '@/stores/suggestion'
import { useToasterStore } from '@/stores/toaster'
import type { Suggestion } from '@/model/Suggestion'
import { useUsersStore } from '@/stores/users'

const route = useRoute()
const router = useRouter()

const userStore = useUsersStore()
const seedStore = useSeedStore()
const suggestionStore = useSuggestionStore()
const toaster = useToasterStore()

let originalSeed = ref<Seed | null>(null)
let suggestionSeed = ref<Seed | null>(null)


watch(
  (): Seed[] => seedStore.seeds,
  (seedsResult) => {
    originalSeed.value = seedsResult.find((s: Seed) => s.id === route.params.id) || null
    if (originalSeed.value) {
      suggestionSeed.value = {
        id: originalSeed.value.id,
        name: originalSeed.value.name,
        species: originalSeed.value.species,
        image: originalSeed.value.image,
        owner: originalSeed.value.owner,
        description: originalSeed.value.description,
        sow: originalSeed.value.sow,
        sentOn: originalSeed.value.sentOn,
        tags: originalSeed.value.tags,
        family: originalSeed.value.family,
        sfgOriginal: originalSeed.value.sfgOriginal,
        sfgMultisow: originalSeed.value.sfgMultisow,
        sfgClump: originalSeed.value.sfgClump,
        germinationMin: originalSeed.value.germinationMin,
        germinationMax: originalSeed.value.germinationMax
      }
    }
  },
  { immediate: true }
)

const buttons = [
  {
    text: 'Hacer sugerencia',
    class: 'btn-primary',
    action: 'save',
    isSubmit: true,
    handler: onSave
  },
  {
    text: 'Cancelar',
    class: 'btn-light',
    action: 'cancel',
    handler: onCancel
  }
] as Button[]

function getUpdatedOrNull<T>(newValue: T, oldValue: T): T | null {
  return newValue === oldValue ? null : newValue
}

function onSave() {
  if (!userStore.user) throw new Error('No user found')
  if (!originalSeed.value) throw new Error('No seed found')
  if (!suggestionSeed.value) throw new Error('No suggestion found')

  const suggestion: Suggestion = {
    id: '',
    seedId: originalSeed.value.id,
    userId: userStore.user.id,
    organizationId: originalSeed.value.owner,
    name: getUpdatedOrNull(suggestionSeed.value.name, originalSeed.value.name),
    species: getUpdatedOrNull(suggestionSeed.value.species, originalSeed.value.species),
    image: getUpdatedOrNull(suggestionSeed.value.image, originalSeed.value.image),
    description: getUpdatedOrNull(suggestionSeed.value.description, originalSeed.value.description),
    sow: getUpdatedOrNull(suggestionSeed.value.sow, originalSeed.value.sow),
    sentOn: getUpdatedOrNull(suggestionSeed.value.sentOn, originalSeed.value.sentOn),
    tags: getUpdatedOrNull(suggestionSeed.value.tags, originalSeed.value.tags),
    family: getUpdatedOrNull(suggestionSeed.value.family, originalSeed.value.family),
    sfgOriginal: getUpdatedOrNull(suggestionSeed.value.sfgOriginal, originalSeed.value.sfgOriginal),
    sfgMultisow: getUpdatedOrNull(suggestionSeed.value.sfgMultisow, originalSeed.value.sfgMultisow),
    sfgClump: getUpdatedOrNull(suggestionSeed.value.sfgClump, originalSeed.value.sfgClump),
    germinationMin: getUpdatedOrNull(suggestionSeed.value.germinationMin, originalSeed.value.germinationMin),
    germinationMax: getUpdatedOrNull(suggestionSeed.value.germinationMax, originalSeed.value.germinationMax),
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  suggestionStore.create(suggestion)
    .then(() => {
      toaster.success({ text: 'Sugerencia enviada correctamente' })
      if (originalSeed.value) router.push({ name: 'seed-detail', params: { id: originalSeed.value.id } })
    }).catch(e => {
    console.error(e)
    toaster.error({ text: 'Error al enviar la sugerencia' })
  })
}

function onCancel() {
  router.push({ name: 'seed-detail', params: { id: route.params.id } })
}

function onAction(action: string) {
  const b = buttons.find(b => b.action === action)
  if (b) b.handler()
}

</script>

<template>
  <div class="container pt-5">
    <h1>Sugerir un cambio</h1>
    <small class="text-muted">Las sugerencias de cambios permiten que todos los usuarios de la biblioteca puedan mejorar
      los datos de las semillas. El proceso de sugerir un cambio requiere de la validación por parte de los dueños del
      registro.</small>

    <SeedForm class="mb-4 mt-5" v-if="suggestionSeed" v-model="suggestionSeed" :buttons="buttons" @action="onAction" />

  </div>

</template>

<style scoped>

</style>