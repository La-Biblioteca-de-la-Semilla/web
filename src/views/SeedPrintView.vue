<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSeedStore } from '@/stores/seed'
import { BOTANICAL_FAMILIES, type Seed } from '@/model/Seed'
import { computed, onMounted, watch, nextTick } from 'vue'
import { useOrganizationStore } from '@/stores/organization'
import type { Organization } from '@/model/Organization'
import nameBg from '@/assets/print_name_bg.svg'
import contentBg from '@/assets/print_content_bg.jpg'

const seedStore = useSeedStore()
const organizationStore = useOrganizationStore()
const route = useRoute()

const seed = computed(() => seedStore.seeds.find((s: Seed) => s.id === route.params.id) || null)
const organization = computed(
  () =>
    organizationStore.organizations.find((o: Organization) => o.id === seed.value?.owner) || null
)

let printed = false

async function waitForImages() {
  const imgs = Array.from(document.querySelectorAll('img'))
  const imgPromises = imgs.map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        })
  )

  // Also wait for CSS background images
  const bgPromise = new Promise<void>((resolve) => {
    const tempImg = new Image()
    tempImg.onload = () => resolve()
    tempImg.onerror = () => resolve()
    tempImg.src = contentBg
  })

  await Promise.all([...imgPromises, bgPromise])
}

async function printWhenReady() {
  if (printed || !seed.value) return
  printed = true
  await waitForImages()
  window.addEventListener('afterprint', () => window.close(), { once: true })
  window.print()
}

onMounted(() => {
  if (!seedStore.isLoading && seed.value) {
    printWhenReady()
  } else {
    const stop = watch(
      () => ({ loading: seedStore.isLoading, seed: seed.value }),
      ({ loading, seed: s }) => {
        if (!loading) {
          stop()
          if (s) {
            nextTick(() => printWhenReady())
          }
        }
      }
    )
  }
})
</script>

<template>
  <div v-if="seed" class="print-page" :style="{ backgroundImage: `url(${contentBg})` }">
    <img class="seed-img" :src="seed.image" alt="" />
    <img v-if="organization" class="logo" :src="organization.image" alt="Logo" />

    <div class="seed-names">
      <div class="seed-names-inner">
        <img class="name-bg" :src="nameBg" alt="" />
        <div class="seed-names-text">
          <h1>{{ seed.name }}</h1>
          <h2>{{ seed.species }}</h2>
          <p v-if="seed.family" class="family">{{ BOTANICAL_FAMILIES[seed.family].text }}</p>
          <p v-if="organization" class="org">{{ organization.name }}</p>
        </div>
      </div>
    </div>

    <div class="description">
      <p v-if="seed.description">{{ seed.description }}</p>
    </div>

    <h3 class="notas-title">Notas:</h3>
    <p class="notas-content"></p>

    <p class="disclaimer">
      Recuerda que nuestras semillas son de polinización abierta y por lo tanto, a pesar de que se
      toman todas las medidas a nuestro alcance para asegurar la pureza varietal podrían suceder, de
      forma excepcional, cruces puntuales que darían lugar a plantas con características distintas a
      las esperadas. Siempre existe esta pequeña cuota de variabilidad genética.
      <br />
      Todas estas semillas son reproducibles y están libres de patentes y registros. Compártelas
      para ayudar a conservar la diversidad cultivada. Si tienes cualquier duda puedes contactar con
      nosotros y te ayudaremos encantados.
    </p>
  </div>
  <div v-else class="no-seed">Semilla no encontrada.</div>
</template>

<style>
@media print {
  @page {
    size: 900px 1280px;
    margin: 0;
  }

  html,
  body,
  #app {
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>

<style scoped>
@font-face {
  font-family: glassAntiqua;
  src: url('@/assets/fonts/GlassAntiqua-Regular.ttf');
}
@font-face {
  font-family: josefinSlab;
  src: url('@/assets/fonts/JosefinSlab-VariableFont_wght.ttf');
}
@font-face {
  font-family: roboto;
  src: url('@/assets/fonts/Roboto-Light.ttf');
}

.print-page {
  width: 900px;
  height: 1280px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  background-size: cover;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
}

.seed-img {
  width: 380px;
  height: 380px;
  object-fit: cover;
  border-radius: 100%;
  position: absolute;
  top: 50px;
  left: 80px;
}

.logo {
  width: 230px;
  position: absolute;
  top: 50px;
  right: 60px;
}

.seed-names {
  width: 510px;
  min-height: 124px;
  position: absolute;
  top: 230px;
  right: 0;
}

.seed-names-inner {
  position: relative;
  width: 100%;
  min-height: 124px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  text-align: center;
  font-family: glassAntiqua, serif;
}

.name-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.seed-names-text {
  position: relative;
  z-index: 1;
}

.seed-names h1 {
  font-family: glassAntiqua, serif;
  font-size: 45px;
  font-weight: normal;
  margin-bottom: 0;
  padding-left: 60px;
  padding-right: 30px;
}

.seed-names h2 {
  font-family: josefinSlab, serif;
  font-size: 25px;
  font-weight: normal;
  margin-top: 0;
  padding-left: 50px;
  padding-right: 20px;
  font-style: italic;
}

.family {
  font-family: roboto, sans-serif;
  font-size: 14px;
  color: #555;
  padding-left: 50px;
  padding-right: 20px;
}

.org {
  font-family: roboto, sans-serif;
  font-size: 14px;
  color: #555;
  padding-left: 50px;
  padding-right: 20px;
}

.description {
  width: 740px;
  height: 300px;
  position: absolute;
  top: 450px;
  left: 80px;
  font-family: josefinSlab, serif;
  font-size: 26px;
  font-weight: normal;
  text-align: justify;
  line-height: 34px;
  overflow: hidden;
}

.description p {
  margin: 0;
}

.notas-title {
  position: absolute;
  top: 750px;
  left: 80px;
  margin: 0;
  font-family: glassAntiqua, serif;
  font-size: 50px;
  font-weight: normal;
}

.notas-content {
  width: 740px;
  height: 350px;
  position: absolute;
  top: 780px;
  left: 80px;
  margin: 0;
  background-image: url('../assets/print_dash.svg');
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.disclaimer {
  width: 740px;
  position: absolute;
  bottom: 25px;
  left: 80px;
  font-family: roboto, sans-serif;
  font-size: 15px;
  text-align: justify;
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.2;
}

.no-seed {
  text-align: center;
  padding: 60px;
  font-family: roboto, sans-serif;
}

@media print {
  .print-page {
    width: 900px;
    height: 1280px;
    margin: 0 !important;
  }
}
</style>
