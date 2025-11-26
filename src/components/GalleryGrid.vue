<script setup lang="ts">

import SeedImageComponent from '@/components/SeedImageComponent.vue'
import type { SeedImage } from '@/model/SeedImage'
import { useReportsStore } from '@/stores/reports'
import GalleryImageModal from '@/components/modals/GalleryImageModal.vue'
import { ref } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps<{
  images: SeedImage[]
  allowAdd: boolean
  allowLoad: boolean
}>()

const emits = defineEmits(['load-more'])

const reportsStore = useReportsStore()
const selectedImage = ref<SeedImage | null>()

function onReport(id: string) {
  reportsStore.openModal('GALLERY_IMAGE', id)
}

function onImageClicked(seedImage: SeedImage) {
  selectedImage.value = seedImage

  const modalElement = document.getElementById('galleryImageModal')

  if (modalElement) {
    const bootstrapModal = new Modal(modalElement)
    bootstrapModal.show()
  }
}

function onLoadMoreImages() {
  emits('load-more')
}

</script>

<template>
  <div>
    <div class="row">
      <div v-for="image in images" :key="image.id"
           class="col-6 col-sm-6 col-md-4 col-lg-3 p-1">
        <SeedImageComponent :image="image" @report="onReport" @image-clicked="onImageClicked(image)" />
      </div>
      <div class="col-6 col-sm-6 col-md-4 col-lg-3 p-1" v-if="props.allowAdd">
        <button class="btn btn-light w-100 squared"
                data-bs-toggle="modal"
                data-bs-target="#seedDetailImageSelectorModal">
          <i class="bi bi-image" /> Añadir imagen
        </button>
      </div>
    </div>
    <div class="row justify-content-md-center mt-3" v-if="allowLoad && images.length">
      <div class="col-md-4 d-grid">
        <button class="btn btn btn-outline-primary" @click.prevent="onLoadMoreImages">
          <i class="bi bi-arrow-down" /> Ver más
        </button>
      </div>
    </div>
    <GalleryImageModal id="galleryImageModal" v-if="selectedImage" :image="selectedImage" />
  </div>
</template>

<style scoped>

.squared {
  aspect-ratio: 1 / 1;
}

</style>