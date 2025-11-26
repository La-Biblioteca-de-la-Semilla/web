<script setup lang="ts">
import SeedCard from '@/components/SeedCard.vue'
import { useSeedStore } from '@/stores/seed'
import { storeToRefs } from 'pinia'
import SeedFiltersBar from '@/components/SeedFiltersCard.vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { type Seed } from '@/model/Seed'
import { useOrganizationStore } from '@/stores/organization'

const userStore = useUsersStore()
const organizationStore = useOrganizationStore()
const { user } = storeToRefs(userStore)
const { organizations, userOrganizations } = storeToRefs(organizationStore)


const seedStore = useSeedStore()
const { isLoading, getSeeds, filters } = storeToRefs(seedStore)

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
    <div class="text-center mt-3 mt-md-5" v-if="isLoading">
      <div class="spinner-border text-primary mt-5" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div class="row mt-3 mt-md-5" v-else-if="getSeeds.length > 0">
      <p class="text-muted mb-1">
        <small>Total: {{ getSeeds.length }}</small>
        <RouterLink :to="{name: 'seed-new'}" class="btn btn-sm btn-primary float-end"
                    v-if="userOrganizations.length > 0">
          <i class="bi-plus-lg"></i>
          Añadir semilla
        </RouterLink>
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
    </div>
    <div v-else>
      <h5 class="text-muted text-center mt-4">Sin resultados</h5>
    </div>
  </main>
</template>

<style scoped>
</style>
