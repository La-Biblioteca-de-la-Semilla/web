<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSeedStore } from '@/stores/seed'
import { type Seed, SQUARE_FOOT_IMAGE } from '@/model/Seed'
import { toTags, type Tag } from '@/model/Tag'
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useOrganizationStore } from '@/stores/organization'
import type { Organization } from '@/model/Organization'
import contentBg from '@/assets/print_new_bg.jpg'
import springIcon from '@/assets/seasons/spring.svg'
import summerIcon from '@/assets/seasons/summer.svg'
import autumnIcon from '@/assets/seasons/autumn.svg'
import winterIcon from '@/assets/seasons/winter.svg'

const seedStore = useSeedStore()
const organizationStore = useOrganizationStore()
const route = useRoute()

const seed = computed(() => seedStore.seeds.find((s: Seed) => s.id === route.params.id) || null)
const organization = computed(
  () =>
    organizationStore.organizations.find((o: Organization) => o.id === seed.value?.owner) || null
)

const seedTags = computed<Tag[]>(() => (seed.value ? toTags(seed.value.tags || []) : []))

const monthSeasons = [
  springIcon,
  springIcon,
  springIcon,
  summerIcon,
  summerIcon,
  summerIcon,
  autumnIcon,
  autumnIcon,
  autumnIcon,
  winterIcon,
  winterIcon,
  winterIcon
]

const descriptionSlot = ref<HTMLElement | null>(null)

const DESCRIPTION_MAX_FONT_SIZE = 25
const DESCRIPTION_MIN_FONT_SIZE = 15

let printed = false

function fitDescription() {
  const slot = descriptionSlot.value
  if (!slot) return

  const text = slot.querySelector<HTMLElement>('.description-text')
  if (!text) return

  let fontSize = DESCRIPTION_MAX_FONT_SIZE
  text.style.fontSize = `${fontSize}px`
  text.style.lineHeight = `${fontSize}px`

  while (slot.scrollHeight > slot.clientHeight && fontSize > DESCRIPTION_MIN_FONT_SIZE) {
    fontSize -= 1
    text.style.fontSize = `${fontSize}px`
    text.style.lineHeight = `${fontSize}px`
  }
}

async function waitForImages() {
  const htmlImgs = Array.from(document.querySelectorAll('img'))

  const htmlPromises = htmlImgs.map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        })
  )

  const bgPromise = new Promise<void>((resolve) => {
    const tempImg = new Image()
    tempImg.onload = () => resolve()
    tempImg.onerror = () => resolve()
    tempImg.src = contentBg
  })

  await Promise.all([...htmlPromises, bgPromise])

  if (document.fonts) {
    await document.fonts.ready
  }
}

async function printWhenReady() {
  if (printed || !seed.value) return
  printed = true
  await waitForImages()
  fitDescription()
  window.addEventListener('afterprint', () => window.close(), { once: true })
  window.print()
}

onMounted(async () => {
  if (organizationStore.organizations.length === 0) {
    try {
      await organizationStore.fetch()
    } catch (e) {
      console.error('Error fetching organizations', e)
    }
  }

  if (seedStore.isLoading) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        () => seedStore.isLoading,
        (loading) => {
          if (!loading) {
            stop()
            resolve()
          }
        },
        { immediate: !seedStore.isLoading }
      )
    })
  }

  if (seed.value) {
    await nextTick()
    fitDescription()
    await printWhenReady()
  }
})
</script>

<template>
  <div v-if="seed" class="print-page" :style="{ backgroundImage: `url(${contentBg})` }">
    <!-- Header Section -->
    <div class="photo-container">
      <img class="seed-img" :src="seed.image" alt="" />
    </div>

    <div v-if="organization?.image" class="logo-box">
      <img class="logo" :src="organization.image" :alt="organization.name" />
    </div>

    <div class="seed-names">
      <div class="seed-title-box">
        <h1 class="seed-title">{{ seed.name }}</h1>
      </div>
      <div class="seed-title-line"></div>
      <h2 v-if="seed.species" class="seed-species">{{ seed.species }}</h2>
    </div>

    <!-- Description Section (fixed slot so the rest of the sheet never moves) -->
    <section ref="descriptionSlot" class="section section-description description-section">
      <p v-if="seed.description" class="description-text">{{ seed.description }}</p>
    </section>

    <!-- Main Content Body -->
    <div class="content-body">
      <!-- Sowing Calendar Section -->
      <section v-if="seed.sow && seed.sow.length > 0" class="section section-sow sow-section">
        <h3 class="section-title">Calendario de siembra</h3>
        <div class="sow-calendar">
          <div v-for="(seasonIcon, i) in monthSeasons" :key="i" class="month-cell">
            <img
              :src="seasonIcon"
              class="month-season-icon"
              :class="{ 'opacity-faint': !seed.sow?.includes(i + 1) }"
              alt=""
            />
          </div>
        </div>
      </section>

      <!-- Technical Specifications (Single Unified Card) -->
      <section
        v-if="seedTags.length > 0 || seed.sfgOriginal || seed.sfgMultisow || seed.sfgClump"
        class="section section-specs specs-card"
      >
        <div class="specs-content">
          <!-- Botanical Tags -->
          <div
            v-if="seedTags.length > 0"
            class="specs-section section-tags"
            :class="{
              'full-width': !seed.sfgOriginal && !seed.sfgMultisow && !seed.sfgClump
            }"
          >
            <h3 class="section-title">Características botánicas</h3>
            <div
              class="tags-container"
              :class="{
                'tags-grid': !seed.sfgOriginal && !seed.sfgMultisow && !seed.sfgClump
              }"
            >
              <div v-for="tag in seedTags" :key="tag.id" class="tag-item">
                <img :src="tag.image" :alt="tag.text" class="tag-icon" />
                <div class="tag-details">
                  <span class="tag-title">{{ tag.text }}</span>
                  <span class="tag-desc">{{ tag.description }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider when both columns are present -->
          <div
            v-if="seedTags.length > 0 && (seed.sfgOriginal || seed.sfgMultisow || seed.sfgClump)"
            class="specs-divider"
          ></div>

          <!-- Square Foot Gardening (SFG) -->
          <div
            v-if="seed.sfgOriginal || seed.sfgMultisow || seed.sfgClump"
            class="specs-section section-sfg"
            :class="{
              'full-width': seedTags.length === 0
            }"
          >
            <h3 class="section-title">Marco de plantación (SFG)</h3>
            <div class="sfg-container">
              <div v-if="seed.sfgOriginal" class="sfg-item">
                <span class="sfg-type-title">Original</span>
                <img :src="SQUARE_FOOT_IMAGE[seed.sfgOriginal]" class="sfg-img" alt="Original" />
              </div>
              <div v-if="seed.sfgMultisow" class="sfg-item">
                <span class="sfg-type-title">Multisow</span>
                <img :src="SQUARE_FOOT_IMAGE[seed.sfgMultisow]" class="sfg-img" alt="Multisow" />
              </div>
              <div v-if="seed.sfgClump" class="sfg-item">
                <span class="sfg-type-title">Macizo</span>
                <img :src="SQUARE_FOOT_IMAGE[seed.sfgClump]" class="sfg-img" alt="Macizo" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer Disclaimer -->
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
  font-family: unigeo;
  src: url('@/assets/fonts/Unigeo64-Regular-trial.ttf');
  font-weight: normal;
}
@font-face {
  font-family: unigeo;
  src: url('@/assets/fonts/Unigeo64-Bold-trial.ttf');
  font-weight: bold;
}
@font-face {
  font-family: unigeo;
  src: url('@/assets/fonts/Unigeo64-Italic-trial.ttf');
  font-weight: normal;
  font-style: italic;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.print-page {
  width: 900px;
  height: 1280px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  background-size: cover;
  background-position: center;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  color: #2b2b2b;
  overflow: hidden;
}

/* Header Section */
.photo-container {
  position: absolute;
  top: 52px;
  left: 84px;
  width: 352px;
  height: 352px;
  border-radius: 50%;
  overflow: hidden;
  background: #ffffff;
}

.seed-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Organization logo over its own background block */
.logo-box {
  position: absolute;
  top: 0;
  right: 24px;
  width: 150px;
  height: 150px;
  background: #647350;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1) opacity(0.75);
}

/* Seed names (title + rule + species) */
.seed-names {
  position: absolute;
  top: 150px;
  left: 490px;
  width: 363px;
}

.seed-title-box {
  min-height: 145px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.seed-title {
  font-family: unigeo, sans-serif;
  font-size: 52px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.05;
  text-align: center;
  color: #000000;
  margin: 0;
}

.seed-title-line {
  width: 100%;
  height: 5px;
  background: #000000;
  margin: 7px 0 6px 0;
}

.seed-species {
  font-family: unigeo, sans-serif;
  font-size: 28px;
  font-weight: normal;
  font-style: italic;
  text-align: center;
  line-height: 1.1;
  color: #1f1f1f;
  margin: 0;
}

/* Content Body */
.content-body {
  position: absolute;
  top: 725px;
  left: 75px;
  width: 750px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section,
[class*='section-'],
[class*='-section'] {
  width: 100%;
}

.section,
[class*='section-'],
[class*='-section'] {
  margin-top: 10px;
}

.content-body > :first-child {
  margin-top: 0;
}

.section-title {
  font-family: unigeo, sans-serif;
  font-size: 24px;
  font-weight: normal;
  color: #2c2523;
  margin: 0 0 6px 0;
  border-bottom: 1px dashed rgba(80, 60, 40, 0.35);
  padding-bottom: 2px;
}

/* Description */
.description-section {
  position: absolute;
  top: 430px;
  left: 75px;
  width: 750px;
  height: 270px;
  margin-top: 0;
  overflow: hidden;
}

.description-text {
  font-family: unigeo, sans-serif;
  font-size: 25px;
  line-height: 25px;
  text-align: justify;
  color: #222;
  margin: 0;
}

/* Sowing Calendar */
.sow-calendar {
  display: flex;
  width: 100%;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.month-cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 2px;
}

.month-season-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.opacity-faint {
  opacity: 0.1;
}

/* Specs Single Unified Card */
.specs-card {
  padding: 12px 16px;
  width: 100%;
}

.specs-content {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: flex-start;
}

.specs-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.specs-section.full-width {
  flex: 1 1 100%;
}

.specs-divider {
  width: 1px;
  background: rgba(100, 80, 60, 0.2);
  align-self: stretch;
}

/* Botanical Tags */
.tags-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tags-container.tags-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(100, 80, 60, 0.15);
  border-radius: 4px;
  padding: 4px 8px;
}

.tag-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.tag-details {
  display: flex;
  flex-direction: column;
}

.tag-title {
  font-family: unigeo, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #2b2b2b;
}

.tag-desc {
  font-family: unigeo, sans-serif;
  font-size: 12px;
  color: #555;
  line-height: 1.2;
}

/* SFG Section */
.sfg-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  padding-top: 4px;
}

.sfg-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.sfg-type-title {
  font-family: unigeo, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 4px;
}

.sfg-img {
  width: 76px;
  height: 76px;
  object-fit: contain;
  background: #fff;
  border: 1px solid rgba(100, 80, 60, 0.25);
  border-radius: 4px;
  padding: 2px;
}

/* Disclaimer */
.disclaimer {
  position: absolute;
  bottom: 25px;
  left: 75px;
  width: 750px;
  font-family: unigeo, sans-serif;
  font-size: 13.5px;
  text-align: justify;
  color: rgba(0, 0, 0, 0.75);
  line-height: 1.25;
  margin: 0;
}

.no-seed {
  text-align: center;
  padding: 60px;
  font-family: unigeo, sans-serif;
}

@media print {
  .print-page {
    width: 900px;
    height: 1280px;
    margin: 0 !important;
  }
}
</style>
