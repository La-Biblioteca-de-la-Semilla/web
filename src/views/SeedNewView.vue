<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import { useSeedStore } from '@/stores/seed'
import { useOrganizationStore } from '@/stores/organization'
import { useRouter } from 'vue-router'
import { useToasterStore } from '@/stores/toaster'
import { type Seed } from '@/model/Seed'
import SeedForm, { type Button } from '@/components/SeedForm.vue'
import { storeToRefs } from 'pinia'


const router = useRouter()

const organizationStore = useOrganizationStore()
const seedStore = useSeedStore()
const toaster = useToasterStore()

const { userOrganizations } = storeToRefs(organizationStore)
const myOrganization = computed(() => userOrganizations.value.length > 0 ? userOrganizations.value[0] : null)
const seed = ref<Seed>({
  id: '',
  name: '',
  species: '',
  image: '',
  owner: myOrganization.value?.id || '',
  sow: [],
  tags: [],
  description: '',
  sentOn: '',
  family: null,
  sfgOriginal: null,
  sfgMultisow: null,
  sfgClump: null,
  germinationMin: null,
  germinationMax: null
})

watch(
  myOrganization,
  (result) => {
    if (result) {
      seed.value.owner = result.id
    }
  },
  { immediate: true }
)


const buttons = [
  {
    text: 'Cancelar',
    class: 'btn-light',
    action: 'cancel',
    handler: onCancel
  },
  {
    text: 'Crear y ver ficha',
    class: 'btn-primary',
    action: 'save_continue',
    isSubmit: true,
    handler: onSaveAndContinue
  },
  {
    text: 'Crear y añadir otra',
    class: 'btn-link',
    action: 'save_stay',
    isSubmit: true,
    handler: onSaveAndAddAnother
  }
] as Button[]


function onCancel() {
  router.push('/')
}

function onSaveAndContinue() {
  onSave().then((seedId: string) => {
    router.push({
      name: 'seed-detail',
      params: {
        id: seedId
      }
    })
  }).catch(() => {
  })
}

function onSaveAndAddAnother() {
  onSave().then(() => {
    if (seed.value) {
      seed.value.name = ''
      seed.value.species = ''
      seed.value.image = ''
      seed.value.description = ''
      seed.value.sow = []
      seed.value.sentOn = ''
      seed.value.tags = []
    }
    window.scrollTo(0, 0)
  }).catch(() => {
  })
}


function onSave() {
  return new Promise<string>((resolve, reject) => {
    if (seed.value && myOrganization) {
      seedStore.create(seed.value).then((result) => {
        toaster.success({ text: 'Semilla creada con éxito' })
        resolve(result.id)
      }).catch(reason => {
        toaster.error({ text: 'Ha ocurrido un error al crear la semilla.\n' + reason })
        console.error(reason)
        reject(reason)
      })
    } else {
      reject('Seed or organization not found on save')
    }
  })
}

function onAction(action: string) {
  const b = buttons.find(b => b.action === action)
  if (b) b.handler()
}

</script>

<template>
  <div class="container pt-5">
    <h1 class="mb-5">Nueva semilla</h1>
    <div class="mb-4">
      <p v-if="myOrganization">
        <a class="btn btn-sm btn-light" :href="myOrganization.url" target="_blank">
          <img :src="myOrganization.image" width="20" height="20" class="rounded-circle"
               :alt="myOrganization.name + ' logo'">
          {{ myOrganization.name }}
        </a>
      </p>
    </div>

    <SeedForm v-if="seed" v-model="seed" :buttons="buttons" @action="onAction" />

  </div>
</template>
