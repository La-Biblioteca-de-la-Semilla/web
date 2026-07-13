<script setup lang="ts">
import SeedCard from '@/components/SeedCard.vue'
import { useSeedStore } from '@/stores/seed'
import { storeToRefs } from 'pinia'
import SeedFiltersBar from '@/components/SeedFiltersCard.vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { type Seed } from '@/model/Seed'
import { useOrganizationStore } from '@/stores/organization'
import { exportSeedsToCsv } from '@/services/csvExportService'
import { ref, onUnmounted, watchEffect } from 'vue'

const userStore = useUsersStore()
const organizationStore = useOrganizationStore()
const { user } = storeToRefs(userStore)
const { organizations, userOrganizations } = storeToRefs(organizationStore)


const seedStore = useSeedStore()
const { isLoading, isLoadingMore, getSeeds, filters, totalSeeds } = storeToRefs(seedStore)

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      seedStore.loadNextPage()
    }
  },
  { rootMargin: '200px' }
)

watchEffect(() => {
  if (sentinel.value) observer!.observe(sentinel.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

const route = useRoute()

const queryQ = route.query['q'] as string
if (queryQ) {
  seedStore.setSearchBarFilter(queryQ)
}


function onWantChange(a: { seed: Seed, state: boolean }) {
  userStore.updateWant(a.seed.id, a.state)
}

function onHaveChange(a: { seed: Seed, state: boolean }) {
  userStore.updateHave(a.seed.id, a.state)
}


function downloadCsv() {
  exportSeedsToCsv(getSeeds.value)
}

</script>

<template>
  <main class="container">
    <form v-on:submit.prevent class="mb-2 pt-md-5 pt-3">
      <div class="input-group input-group-lg">
        <input
          type="search"
          class="form-control"
          v-model="filters.searchBar"
          placeholder="Buscar..."
          aria-label="Search"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#filtersCollapse"
          aria-expanded="false"
          aria-controls="filtersCollapse"
        >
          Filtros <i class="bi bi-filter"></i>
        </button>
      </div>
      <div class="collapse" id="filtersCollapse">
        <seed-filters-bar></seed-filters-bar>
      </div>
    </form>
    <div class="text-center mt-3 mt-md-5" v-if="isLoading && !isLoadingMore">
      <div class="spinner-border text-primary mt-5" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div class="row mt-3 mt-md-5" v-else-if="getSeeds.length > 0">
      <p class="text-muted mb-1 d-flex align-items-center flex-wrap gap-2">
        <small>Total: {{ totalSeeds }}</small>
        <span class="ms-auto d-flex align-items-center gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-success"
            @click="downloadCsv"
            title="Descargar listado de semillas filtradas en formato CSV"
            aria-label="Descargar CSV"
          >
            <i class="bi bi-download me-1"></i>
            <span class="d-none d-sm-inline">Descargar CSV</span>
            <span class="d-inline d-sm-none">CSV</span>
          </button>
          <RouterLink :to="{name: 'seed-new'}" class="btn btn-sm btn-primary"
                      v-if="userOrganizations.length > 0">
            <i class="bi-plus-lg"></i>
            Añadir semilla
          </RouterLink>
        </span>
      </p>
      <div class="col-lg-6" v-for="seed in getSeeds" :key="seed.id">
        <seed-card
          :seed="seed"
          :organization="organizations?.find(o => o.id === seed.owner)"
          :user="user"
          @onWantChange="onWantChange"
          @onHaveChange="onHaveChange"
        ></seed-card>
      </div>
      <div ref="sentinel" class="py-2"></div>
      <div class="text-center py-3" v-if="isLoadingMore">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Cargando más...</span>
        </div>
      </div>
    </div>
    <div v-else>
      <h5 class="text-muted text-center mt-4">Sin resultados</h5>
    </div>
  </main>
</template>

<style scoped>
</style>
