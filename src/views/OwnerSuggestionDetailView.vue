<script setup lang="ts">

import type { Suggestion } from '@/model/Suggestion'
import { computed, ref } from 'vue'
import { useSuggestionStore } from '@/stores/suggestion'
import { useRoute, useRouter } from 'vue-router'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import { useSeedStore } from '@/stores/seed'
import SowingSessionInfo from '@/components/SowingSessionInfo.vue'
import { toTags } from '@/model/Tag'
import TagBadge from '@/components/TagBadge.vue'
import { storeToRefs } from 'pinia'
import type { Seed } from '@/model/Seed'

const route = useRoute()
const router = useRouter()

const seedStore = useSeedStore()
const { seeds } = storeToRefs(seedStore)

const suggestionStore = useSuggestionStore()
const { suggestions } = storeToRefs(suggestionStore)
const suggestion = computed(() => suggestions.value.find((s: Suggestion) => s.id === route.params.id))
const seed = computed(() => seeds.value.find((s: Seed) => s.id === suggestion.value?.seedId))

const nameCheck = ref<Boolean>(false)
const speciesCheck = ref<Boolean>(false)
const imageCheck = ref<Boolean>(false)
const descriptionCheck = ref<Boolean>(false)
const sowCheck = ref<Boolean>(false)
const sentOnCheck = ref<Boolean>(false)
const tagsCheck = ref<Boolean>(false)
const familyCheck = ref<Boolean>(false)
const sfgOriginalCheck = ref<Boolean>(false)
const sfgMultisowCheck = ref<Boolean>(false)
const sfgClumpCheck = ref<Boolean>(false)
const germinationMinCheck = ref<Boolean>(false)
const germinationMaxCheck = ref<Boolean>(false)

const isAnyAccepted = computed(() => {
  return (
    nameCheck.value ||
    speciesCheck.value ||
    imageCheck.value ||
    descriptionCheck.value ||
    sowCheck.value ||
    sentOnCheck.value ||
    tagsCheck.value ||
    familyCheck.value ||
    sfgOriginalCheck.value ||
    sfgMultisowCheck.value ||
    sfgClumpCheck.value ||
    germinationMinCheck.value ||
    germinationMaxCheck.value
  )
})

async function onAccept() {
  if (suggestion.value && seed.value) {
    const sugg = suggestion.value
    const seedStore = useSeedStore()

    seed.value.name = nameCheck.value && sugg.name ? sugg.name : seed.value.name
    seed.value.species = speciesCheck.value && sugg.species ? sugg.species : seed.value.species
    seed.value.image = imageCheck.value && sugg.image ? sugg.image : seed.value.image
    seed.value.description = descriptionCheck.value && sugg.description ? sugg.description : seed.value.description
    seed.value.sow = sowCheck.value && sugg.sow ? sugg.sow : seed.value.sow
    seed.value.sentOn = sentOnCheck.value && sugg.sentOn ? sugg.sentOn : seed.value.sentOn
    seed.value.tags = tagsCheck.value && sugg.tags ? sugg.tags : seed.value.tags
    seed.value.family = familyCheck.value && sugg.family ? sugg.family : seed.value.family
    seed.value.sfgOriginal = sfgOriginalCheck.value && sugg.sfgOriginal ? sugg.sfgOriginal : seed.value.sfgOriginal
    seed.value.sfgMultisow = sfgMultisowCheck.value && sugg.sfgMultisow ? sugg.sfgMultisow : seed.value.sfgMultisow
    seed.value.sfgClump = sfgClumpCheck.value && sugg.sfgClump ? sugg.sfgClump : seed.value.sfgClump
    seed.value.germinationMin = germinationMinCheck.value && sugg.germinationMin !== null ? sugg.germinationMin : seed.value.germinationMin
    seed.value.germinationMax = germinationMaxCheck.value && sugg.germinationMax !== null ? sugg.germinationMax : seed.value.germinationMax

    await seedStore.update(seed.value)

    sugg.status = 'ACCEPTED'
    await suggestionStore.accept(sugg)

    await router.push({ name: 'suggestions' })
  }
}

async function onReject() {
  if (suggestion.value) {
    suggestion.value.status = 'REJECTED'
    await suggestionStore.reject(suggestion.value)

    await router.push({ name: 'suggestions' })
  }
}

</script>

<template>
  <div class="container pt-5">
    <h1>Sugerencia de cambio</h1>
    <section v-if="suggestion && seed">
      <table class="table">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Valor actual</th>
          <th scope="col">Sugerencia</th>
          <th scope="col">Aceptar cambio</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="suggestion.name">
          <th scope="row">Nombre</th>
          <td>{{ seed.name }}</td>
          <td>{{ suggestion.name }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="nameCheck" v-model="nameCheck">
              <label class="form-check-label" :class="{'text-success':nameCheck}" for="nameCheck">
                {{ nameCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.species">
          <th scope="row">Nombre científico</th>
          <td>{{ seed.species }}</td>
          <td>{{ suggestion.species }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="speciesCheck" v-model="speciesCheck">
              <label class="form-check-label" :class="{'text-success':speciesCheck}" for="speciesCheck">
                {{ speciesCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.image">
          <th scope="row">Imagen</th>
          <td>
            <img class="img-fluid" :src="seed.image" />
          </td>
          <td>
            <img class="img-fluid" :src="suggestion.image" />
          </td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="imageCheck" v-model="imageCheck">
              <label class="form-check-label" :class="{'text-success':imageCheck}" for="imageCheck">
                {{ imageCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.description">
          <th scope="row">Descripción</th>
          <td>{{ seed.description }}</td>
          <td>{{ suggestion.description }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="descriptionCheck" v-model="descriptionCheck">
              <label class="form-check-label" :class="{'text-success':descriptionCheck}" for="descriptionCheck">
                {{ descriptionCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.sow">
          <th scope="row">Siembra</th>
          <td>
            <SowingSessionInfo :sow="seed.sow" />
          </td>
          <td>
            <SowingSessionInfo :sow="suggestion.sow" />
          </td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="sowCheck" v-model="sowCheck">
              <label class="form-check-label" :class="{'text-success':sowCheck}" for="sowCheck">
                {{ sowCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.sentOn">
          <th scope="row">Envío</th>
          <td>{{ seed.sentOn }}</td>
          <td>{{ suggestion.sentOn }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="sentOnCheck" v-model="sentOnCheck">
              <label class="form-check-label" :class="{'text-success':sentOnCheck}" for="sentOnCheck">
                {{ sentOnCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.tags">
          <th scope="row">Etiquetas</th>
          <td>
            <TagBadge
              v-for="(tag, i) in toTags(seed.tags)"
              :key="i"
              :tag="tag"
            />
          </td>
          <td>
            <TagBadge
              v-for="(tag, i) in toTags(suggestion.tags)"
              :key="i"
              :tag="tag"
            />
          </td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="tagsCheck" v-model="tagsCheck">
              <label class="form-check-label" :class="{'text-success':tagsCheck}" for="tagsCheck">
                {{ tagsCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.family">
          <th scope="row">Familia botánica</th>
          <td>{{ seed.family }}</td>
          <td>{{ suggestion.family }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="familyCheck" v-model="familyCheck">
              <label class="form-check-label" :class="{'text-success':familyCheck}" for="familyCheck">
                {{ familyCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.sfgOriginal">
          <th scope="row">SFG - Original</th>
          <td>{{ seed.sfgOriginal }}</td>
          <td>{{ suggestion.sfgOriginal }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="sfgOriginalCheck" v-model="sfgOriginalCheck">
              <label class="form-check-label" :class="{'text-success':sfgOriginalCheck}" for="sfgOriginalCheck">
                {{ sfgOriginalCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.sfgMultisow">
          <th scope="row">SFG - Multisow</th>
          <td>{{ seed.sfgMultisow }}</td>
          <td>{{ suggestion.sfgMultisow }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="sfgMultisowCheck" v-model="sfgMultisowCheck">
              <label class="form-check-label" :class="{'text-success':sfgMultisowCheck}" for="sfgMultisowCheck">
                {{ sfgMultisowCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.sfgClump">
          <th scope="row">SFG - Clump</th>
          <td>{{ seed.sfgClump }}</td>
          <td>{{ suggestion.sfgClump }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="sfgClumpCheck" v-model="sfgClumpCheck">
              <label class="form-check-label" :class="{'text-success':sfgClumpCheck}" for="sfgClumpCheck">
                {{ sfgClumpCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.germinationMin !== null">
          <th scope="row">Germination temperature - Min</th>
          <td>{{ seed.germinationMin }}</td>
          <td>{{ suggestion.germinationMin }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="germinationMinCheck"
                     v-model="germinationMinCheck">
              <label class="form-check-label" :class="{'text-success':sfgClumpCheck}" for="germinationMinCheck">
                {{ germinationMinCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="suggestion.germinationMax !== null">
          <th scope="row">Germination temperature - Max</th>
          <td>{{ seed.germinationMax }}</td>
          <td>{{ suggestion.germinationMax }}</td>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="germinationMaxCheck"
                     v-model="germinationMaxCheck">
              <label class="form-check-label" :class="{'text-success':sfgClumpCheck}" for="germinationMaxCheck">
                {{ germinationMaxCheck ? 'Aceptado' : 'Aceptar' }}
              </label>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="d-grid gap-2 d-md-flex justify-content-md-center">
        <button class="btn btn-primary" v-if="isAnyAccepted" @click.prevent="onAccept">
          <i class="bi bi-bandaid" /> Aceptar cambios
        </button>
        <button v-else class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#suggestionRejectModal">
          <i class="bi bi-trash" /> Rechazar cambios
        </button>
      </div>
    </section>

    <ConfirmationModal id="suggestionRejectModal" @confirmed="onReject"></ConfirmationModal>
  </div>
</template>

<style scoped>

</style>