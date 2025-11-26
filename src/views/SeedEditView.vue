<script setup lang="ts">
import SeedForm, {type Button} from "@/components/SeedForm.vue";
import {useSeedStore} from "@/stores/seed";
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {type Seed} from "@/model/Seed";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";
import {useToasterStore} from "@/stores/toaster";

const route = useRoute()
const router = useRouter()

const toaster = useToasterStore()
const seedStore = useSeedStore()

let originalSeed = ref<Seed | null>(null)
let seed = ref<Seed | null>(null)


watch(
    (): Seed[] => seedStore.seeds,
    (seedsResult) => {
      originalSeed.value = seedsResult.find((s: Seed) => s.id === route.params.id) || null
      if (originalSeed.value) {
        seed.value = {...originalSeed.value}
      }
    },
    {immediate: true}
)

const buttons = [
  {
    text: "Guardar",
    class: "btn-primary",
    action: "save",
    isSubmit: true,
    handler: onSave
  },
  {
    text: "Cancelar",
    class: "btn-light",
    action: "cancel",
    handler: onCancel
  }
] as Button[]


function onDeleteConfirmed() {
  if (seed.value !== null) {
    seedStore.delete(seed.value.id)
        .then(() => {
          toaster.success({text: "Semilla eliminada con éxito."})
          router.push("/")
        })
        .catch(reason => {
          console.error(reason)
          toaster.error({text: "Ha ocurrido un error al eliminar la semilla."})
        })
  }
}

function onSave() {
  const sv = seed.value
  if (!sv) return;

  seedStore.update(sv)
      .then((value: Partial<Seed>) => {
        if (originalSeed.value) {
          Object.assign(originalSeed.value, value);
          router.push({name: 'seed-detail', params: {id: sv.id}});
        }
      })
      .catch(console.error);
}

function onCancel() {
  router.push({name: 'seed-detail', params: {id: route.params.id}})
}

function onAction(action: string) {
  const b = buttons.find(b => b.action === action)
  if (b) b.handler()
}

</script>

<template>
  <div class="container pt-5">
    <h1 class="mb-5">Editar semilla</h1>
    <button class="btn btn-danger float-end" data-bs-toggle="modal" data-bs-target="#deleteSeedModal">
      <i class="bi-trash"/> Eliminar
    </button>

    <SeedForm v-if="seed" v-model="seed" :buttons="buttons" @action="onAction"/>

    <ConfirmationModal :id="'deleteSeedModal'" @confirmed="onDeleteConfirmed"></ConfirmationModal>
  </div>

</template>

<style scoped>

</style>