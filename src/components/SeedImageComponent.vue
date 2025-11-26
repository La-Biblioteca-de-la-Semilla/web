<script setup lang="ts">
import type { SeedImage } from '@/model/SeedImage'

const props = defineProps<{
  image: SeedImage
}>()

const emit = defineEmits(['report', 'image-clicked'])

function onReport() {
  emit('report', props.image.id)
}

function onImageClicked() {
  emit('image-clicked', props.image.id)
}

</script>

<template>
  <div class="position-relative">
    <img :src="props.image.src" class="img-fluid seed-img" alt="" @click="onImageClicked">
    <div class="dropdown overlay-dropdown">
      <button class="btn btn-sm btn-outline-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-three-dots-vertical" />
      </button>
      <ul class="dropdown-menu">
        <li>
          <RouterLink :to="{ name: 'seed-detail', params: { id: props.image.seedId } }" class="dropdown-item">
            Ver semilla
          </RouterLink>
        </li>
        <li class="dropdown-divider" />
        <li>
          <a class="dropdown-item text-danger" href="#" @click.prevent="onReport">
            <i class="bi bi-exclamation-circle me-2" />Reportar
          </a>
        </li>
      </ul>
    </div>
    <small class="badge text-bg-light overlay-text">por <i>{{ props.image.createdBy }}</i></small>
  </div>
</template>

<style scoped>
.seed-img {
  width: 100%;
  object-fit: cover;
}

.overlay-text {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1;
}

.overlay-dropdown {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
}

.overlay-dropdown button {
  border: 0;
}

</style>