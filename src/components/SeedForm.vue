<script setup lang="ts">

import {ref} from "vue";
import {BOTANICAL_FAMILIES, type Seed} from "@/model/Seed";
import {useToasterStore} from "@/stores/toaster";
import SFGSelector from "@/components/SFGSelector.vue";
import ImageSelectorModal from "@/components/modals/ImageSelectorModal.vue";
import SowingSessionSelector from "@/components/SowingSessionSelector.vue";
import {TAGS} from "@/model/Tag";
import TagCheckButton from "@/components/TagCheckButton.vue";

export type Button = {
  text: string,
  class: string,
  action: string,
  isSubmit: boolean,
  handler: Function
}

const toaster = useToasterStore()
const model = defineModel<Seed>({required: true})
const props = defineProps<{
  buttons: Button[]
}>()

const emit = defineEmits(['action'])

const seedNameBlurred = ref<boolean>(false)
const seedScientificNameBlurred = ref<boolean>(false)
const seedImageBlurred = ref<boolean>(false)

function onImageSelected(image: string) {
  model.value.image = image
}

function isEmpty(value: string) {
  return value.length === 0
}

function onAction(action: string, isSubmit: boolean) {
  if (isSubmit) {
    [seedNameBlurred.value, seedScientificNameBlurred.value, seedImageBlurred.value] = [true, true, true];

    const {name, species, image} = model.value;
    if ([name, species, image].some(isEmpty)) {
      toaster.error({text: "Hay errores en el formulario. Por favor, revísalo."});
    } else {
      emit('action', action);
    }
  } else {
    emit('action', action);
  }
}

</script>

<template>
  <form class="needs-validation">
    <div class="row">
      <div class="col-md-3 p-0" v-if="model.image.length <= 0">
        <button class="btn btn-light w-100 squared"
                :class="{'border-danger': isEmpty(model.image) && seedImageBlurred}"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#seedFormImageSelectorModal">
          <i class="bi bi-image"/> Añadir imagen *
        </button>
        <div class="invalid-feedback" :class="{'d-block': isEmpty(model.image) && seedImageBlurred}">Selecciona una
          imagen.
        </div>
      </div>


      <div class="col-md-3 p-0" v-else>
        <label for="imageFile" class="form-label">Imagen *</label>
        <div v-if="model.image.length > 0">
          <img class="w-100 squared" :src="model.image"><br/>
          <button class="btn btn-sm btn-light w-100"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#seedFormImageSelectorModal">
            <i class="bi bi-images mx-1"/> Reemplazar imagen
          </button>
        </div>
      </div>

      <div class="col-md-9">
        <div class="mb-4">
          <label for="seedName" class="form-label">Nombre común *</label>
          <input type="text" class="form-control form-control-lg" id="seedName"
                 placeholder="Escribe aqui el nombre común"
                 :class="{'is-invalid' : isEmpty(model.name) && seedNameBlurred }"
                 @blur="seedNameBlurred = true"
                 v-model="model.name">
          <div class="invalid-feedback">
            Introduce el nombre común de la semilla.
          </div>
        </div>

        <div class="mb-4">
          <label for="seedScientificName" class="form-label">Nombre científico *</label>
          <input type="text" class="form-control" id="seedScientificName"
                 placeholder="Escribe aqui el nombre científico"
                 :class="{'is-invalid' : isEmpty(model.species) && seedScientificNameBlurred}"
                 @blur="seedScientificNameBlurred = true"
                 v-model="model.species">
          <div class="invalid-feedback">
            Introduce un nombre científico para la semilla.
          </div>
        </div>

        <div class="mb-4">
          <label for="botanicalFamily" class="form-label">Familia botánica</label>
          <select class="form-select" id="botanicalFamily" aria-label="Botanical family select" v-model="model.family">
            <option selected :value="null">Elige la familia botánica...</option>
            <option v-for="(value, key) in BOTANICAL_FAMILIES" :key="key" :value="key">
              {{ value.text }} ({{ value.examples.join(", ") }})
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="seedSentOnName" class="form-label">Envío</label>
          <input type="text" class="form-control" id="seedSentOnName" placeholder="Fecha o paquete de envío"
                 v-model="model.sentOn">
        </div>
      </div>
    </div>
    <div class="row my-4">
      <div class="col-md-6">
        <div class="mb-4">
          <label class="form-label">Siembra</label>
          <p>
            <SowingSessionSelector v-model="model.sow"/>
          </p>
        </div>
        <div class="mb-4">
          <label class="form-label">Etiquetas</label>
          <p>
            <TagCheckButton
                v-for="(tag, i) in TAGS"
                :key="i"
                :tag="tag"
                v-model="model.tags"
            />
          </p>
        </div>
        <div class="mb-4">
          <label class="form-label">Germinación</label>
          <div class="input-group mb-3">
            <span class="input-group-text" id="germinationTemperature">Temperatura óptima</span>
            <input type="number" class="form-control" placeholder="Mínimo" aria-label="germinationMin"
                   aria-describedby="germinationTemperature" v-model="model.germinationMin">
            <input type="number" class="form-control" placeholder="Máximo" aria-label="germinationMax"
                   aria-describedby="germinationTemperature" v-model="model.germinationMax">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-4">
          <label class="form-label">Square Foot Gardening</label>
          <SFGSelector v-model="model.sfgOriginal" :text="'Original'"/>
          <SFGSelector v-model="model.sfgMultisow" :text="'Multisow'"/>
          <SFGSelector v-model="model.sfgClump" :text="'Macizo'"/>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="mb-4">
          <label for="seedDescripton" class="form-label">Descripción</label>
          <textarea v-model="model.description" class="form-control" id="seedDescripton" rows="5"
                    placeholder="Escribe una descripción: origen, usos, curiosidades, etc."></textarea>
        </div>
      </div>
    </div>
    <div class="mb-4 text-center ">
      <div class="d-grid gap-2 d-md-flex justify-content-md-center">
        <button class="btn" v-for="(b, i) in props.buttons" :key="i" @click.prevent="onAction(b.action, b.isSubmit)"
                :class="b.class">{{ b.text }}
        </button>
      </div>
    </div>

    <ImageSelectorModal id="seedFormImageSelectorModal" @finished="onImageSelected"/>
  </form>
</template>

<style scoped>
.squared {
  aspect-ratio: 1 / 1;
}
</style>