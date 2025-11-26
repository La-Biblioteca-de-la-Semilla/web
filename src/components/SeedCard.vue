<script setup lang="ts">
import TagBadge from '@/components/TagBadge.vue'
import { BOTANICAL_FAMILIES, type Seed } from '@/model/Seed'
import { toTags } from '@/model/Tag'
import SowingSessionInfo from '@/components/SowingSessionInfo.vue'
import { computed } from 'vue'
import { type User } from '@/model/User'
import VLazyImage from 'v-lazy-image'
import logo from '@/assets/logo.svg'
import type { Organization } from '@/model/Organization'

interface Props {
  seed: Seed,
  user: User | null,
  organization?: Organization
}

const props = defineProps<Props>()
const emit = defineEmits(['onHaveChange', 'onWantChange'])

const haveState = computed({
  get: () => props.user?.have.includes(props.seed.id) || false,
  set: (value) => {
    emit('onHaveChange', {
      seed: props.seed as Seed,
      state: value as boolean
    })
  }
})

let wantState = computed({
  get: () => props.user?.want.includes(props.seed.id) || false,
  set: (value) => {
    emit('onWantChange', {
      seed: props.seed as Seed,
      state: value as boolean
    })
  }
})

</script>

<template>
  <div class="card mb-3">
    <div class="row g-0">
      <div class="col-md-4">
        <RouterLink :to="{name: 'seed-detail', params:{id: seed.id}}">
          <v-lazy-image v-bind:src="seed.image" class="img-fluid seed-img" alt="..." />
        </RouterLink>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <div class="float-end">
            <RouterLink class="btn btn-sm btn-outline-primary" :to="{name: 'seed-detail', params:{id: seed.id}}">Ver
              más
            </RouterLink>
          </div>
          <h5 class="card-title">{{ seed.name }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">{{ seed.species }}</h6>
          <p>
            <a class="btn btn-sm btn-light" v-if="organization" :href="organization.url" target="_blank">
              <img :src="organization.image" width="20" height="20" class="rounded-circle"
                   :alt="organization.name + ' logo'">
              {{ organization.name }}
            </a>
            <small class="text-muted float-end"> {{ seed.sentOn }}</small>
          </p>
          <p class="card-text">
            <span class="badge text-bg-light" v-if="seed.family && BOTANICAL_FAMILIES[seed.family]">
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
        </div>
      </div>
    </div>
    <div class="card-footer text-muted" v-if="user">
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
</template>

<style scoped>

.seed-img {
  width: 100%;
  height: 100%;
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
