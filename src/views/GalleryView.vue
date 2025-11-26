<script setup lang="ts">

import { useSeedImagesStore } from '@/stores/seedImages'
import { storeToRefs } from 'pinia'
import GalleryGrid from '@/components/GalleryGrid.vue'

const seedImages = useSeedImagesStore()
const { images } = storeToRefs(seedImages)

seedImages.fetchNext()

function onLoadMore() {
  seedImages.fetchNext()
}

</script>

<template>
  <section class="container">
    <h1 class="mb-4 pt-5">La Galería</h1>
    <small class="text-muted">
      La galería de imágenes es un espacio para celebrar el esfuerzo y la pasión de nuestra comunidad, donde encontrarás
      fotos compartidas por los usuarios que muestran el progreso de sus cultivos, desde los primeros brotes hasta
      cosechas llenas de vida. ¡Anímate a participar y comparte las fotos de tus cultivos en la galería de cada
      semilla!
    </small>
    <GalleryGrid class="mt-4" :images="images" :allow-add="false" :allow-load="true" @load-more="onLoadMore" />
  </section>
</template>
