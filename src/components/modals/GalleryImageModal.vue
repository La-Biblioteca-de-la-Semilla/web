<script setup lang="ts">

import type { SeedImage } from '@/model/SeedImage'
import { useSeedStore } from '@/stores/seed'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const props = defineProps<{
  image: SeedImage
}>()

const router = useRouter()
const seedStore = useSeedStore()
const { seeds } = storeToRefs(seedStore)

const seed = computed(() => {
  return seeds.value.find(s => s.id === props.image.seedId)
})

function onViewSeed() {
  router.push({ name: 'seed-detail', params: { id: seed.value?.id } })
}

</script>

<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="seedImageModalLabel"
       aria-modal="true" aria-hidden="true" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body p-0 position-relative">
          <img class="img-fluid" :src="image.src" style="width: 100%" alt="">
          <button type="button" class="btn-close bg-light p-2 position-absolute top-0 end-0" data-bs-dismiss="modal"
                  aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="btn-group float-end">
            <button class="btn btn-outline-secondary" @click.prevent="onViewSeed" data-bs-dismiss="modal">Ver ficha
            </button>
          </div>
          <p class="modal-title fs-5" id="seedImageModalLabel">{{ seed?.name }}</p>
          <p class="modal-title" id="seedImageModalLabel">por {{ image.createdBy }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>