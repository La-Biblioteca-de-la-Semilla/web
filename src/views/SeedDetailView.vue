<script setup lang="ts">

import { useRoute } from 'vue-router'
import { useSeedStore } from '@/stores/seed'
import { BOTANICAL_FAMILIES, type Seed, SQUARE_FOOT_IMAGE } from '@/model/Seed'
import { toTags } from '@/model/Tag'
import { computed, watch } from 'vue'
import SowingSessionInfo from '@/components/SowingSessionInfo.vue'
import TagBadge from '@/components/TagBadge.vue'
import { useUsersStore } from '@/stores/users'
import { useToasterStore } from '@/stores/toaster'
import ImageSelectorModal from '@/components/modals/ImageSelectorModal.vue'
import { useSeedImagesStore } from '@/stores/seedImages'
import { storeToRefs } from 'pinia'
import logo from '@/assets/logo.svg'
import GalleryGrid from '@/components/GalleryGrid.vue'
import { useOrganizationStore } from '@/stores/organization'
import type { Organization } from '@/model/Organization'

const toaster = useToasterStore()
const userStore = useUsersStore()
const organizationStore = useOrganizationStore()
const seedStore = useSeedStore()
const seedImagesStore = useSeedImagesStore()
const { user } = storeToRefs(userStore)
const { organizations } = storeToRefs(organizationStore)
const { seeds } = storeToRefs(seedStore)
const { seedImages } = storeToRefs(seedImagesStore)

const route = useRoute()

const seed = computed(() => seeds.value.find((s: Seed) => s.id === route.params.id) || null)
const organization = computed(() => organizations.value.find((o: Organization) => o.id === seed.value?.owner) || null)
const haveState = computed({
  get: () => user.value && seed.value ? user.value.have.includes(seed.value.id) : false,
  set: (value) => {
    if (seed.value) userStore.updateHave(seed.value.id, value)
  }
})

let wantState = computed({
  get: () => user.value && seed.value ? user.value.want.includes(seed.value.id) : false,
  set: (value) => {
    if (seed.value) userStore.updateWant(seed.value.id, value)
  }
})

watch(
  seed,
  (result) => {
    if (result) {
      seedImagesStore.fetchBySeedId(result.id)
    }
  },
  { immediate: true }
)

function onShare() {
  navigator.clipboard.writeText(window.location.href)
  toaster.info({ text: 'Semilla copiada al portapapeles.' })
}

function onImageAdded(image: string) {
  if (seed.value) {
    seedImagesStore.create(seed.value.id, image)
  }
}

</script>

<template>
  <div class="container" v-if="seed">
    <nav class="mb-2 pt-md-5 pt-3" style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink :to="{name: 'home'}">Inicio</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ seed.name }}</li>
      </ol>
    </nav>
    <section>
      <div class="row g-0">
        <div class="col-md-4">
          <img v-bind:src="seed.image" class="img-fluid seed-img pe-3" alt="..." />
        </div>
        <div class="col-md-8 mt-4 mt-md-0">
          <div class="btn-group float-end">
            <button class="btn btn-sm btn-light" @click.prevent="onShare">
              <i class="bi-share" /> Compartir
            </button>
            <button v-if="user" type="button" class="btn btn-sm btn-light dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
              <span class="visually-hidden">Acciones</span>
            </button>
            <ul class="dropdown-menu" v-if="user && organization?.owner === user.id">
              <li>
                <RouterLink
                  :to="{name: 'seed-edit', params:{id: seed.id}}"
                  class="dropdown-item">
                  <i class="bi-pencil" /> Editar
                </RouterLink>
              </li>
            </ul>
            <ul class="dropdown-menu" v-else-if="user">
              <RouterLink
                :to="{name: 'seed-suggestion', params:{id: seed.id}}"
                class="dropdown-item">
                <i class="bi bi-bandaid" /> Sugerir un cambio
              </RouterLink>
            </ul>
          </div>

          <h1 class="mb-0">{{ seed.name }}</h1>
          <h2 class="mb-2 text-muted">{{ seed.species }}</h2>
          <p class="mb-3" v-if="organization">
            <a class="btn btn-sm btn-light" v-if="seed.owner" :href="organization.url" target="_blank">
              <img :src="organization.image" width="20" height="20" class="rounded-circle"
                   :alt="organization.name + ' logo'">
              {{ organization.name }}
            </a>
            <small class="text-muted ms-3 float-end"> {{ seed.sentOn }}</small>
          </p>
          <p class="mb-3">
            <span class="badge text-bg-light" v-if="seed.family">
              <img class="img-fluid" :src="logo" alt="" style="max-height: 25px; padding: 3px" />
              {{ BOTANICAL_FAMILIES[seed.family].text }}
            </span>
            <TagBadge
              v-for="(tag, i) in toTags(seed.tags)"
              :key="i"
              :tag="tag"
            />
          </p>
          <SowingSessionInfo :sow="seed.sow"></SowingSessionInfo>

          <div class="text-muted" v-if="user">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" :id="'haveCheckbox-' + seed.id"
                     v-model="haveState">
              <label class="form-check-label" :for="'haveCheckbox-' + seed.id">La tengo</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" :id="'wantCheckbox-' + seed.id"
                     v-model="wantState">
              <label class="form-check-label" :for="'wantCheckbox-' + seed.id">La quiero</label>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mt-5">
      <ul class="nav nav-tabs nav-fill">
        <li class="nav-item">
          <a href="#info" class="nav-link active" data-bs-toggle="tab">Más información</a>
        </li>
        <li class="nav-item" v-if="user">
          <a href="#gallery" class="nav-link" data-bs-toggle="tab">Galería</a>
        </li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane fade show active mt-4" id="info">
          <div v-if="seed.description">
            <h4>Descripción</h4>
            <p>{{ seed.description }}</p>
          </div>
          <div v-if="seed.sfgOriginal || seed.sfgMultisow || seed.sfgMultisow" class="mt-5">
            <h4>Square Foot Gardening</h4>

            <table class="table table-borderless w-auto">
              <thead class="text-center">
              <tr>
                <th scope="col" v-if="seed.sfgOriginal">Original</th>
                <th scope="col" v-if="seed.sfgMultisow">Multisow</th>
                <th scope="col" v-if="seed.sfgClump">Macizo</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td v-if="seed.sfgOriginal">
                  <img class="img-fluid img-thumbnail rounded" :src="SQUARE_FOOT_IMAGE[seed.sfgOriginal]" />
                </td>
                <td v-if="seed.sfgMultisow">
                  <img class="img-fluid img-thumbnail rounded" :src="SQUARE_FOOT_IMAGE[seed.sfgMultisow]" />
                </td>
                <td v-if="seed.sfgClump">
                  <img class="img-fluid img-thumbnail rounded" :src="SQUARE_FOOT_IMAGE[seed.sfgClump]" />
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div v-if="seed.germinationMin !== null || seed.germinationMax !== null">
            <h4>Germinación</h4>
            <p>Temperatura óptima:
              <a v-if="seed.germinationMin !== null"><i class="bi bi-thermometer" />
                Mínimo: {{ seed.germinationMin }}
              </a>
              <a v-if="seed.germinationMax !== null"><i class="bi bi-thermometer-high" />
                Máximo: {{ seed.germinationMax }}
              </a>
            </p>
          </div>
        </div>
        <div class="tab-pane fade show" id="gallery">
          <GalleryGrid :images="seedImages" :allowAdd="user !== null" :allow-load="false" />
        </div>
      </div>
    </section>

    <ImageSelectorModal id="seedDetailImageSelectorModal" @finished="onImageAdded" />
  </div>

</template>

<style scoped>

.seed-img {
  width: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .seed-img {
    width: 100%;
    height: 30vh;
    object-fit: cover;
  }
}

</style>