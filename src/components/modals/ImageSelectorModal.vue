<script setup lang="ts">
import ImageSelector from "@/components/ImageSelector.vue";
import {ref} from "vue";

const props = defineProps<{
  id: string
}>()

const emits = defineEmits(['finished'])

const image = ref<string | null>(null)

function onImageSelected(result: string) {
  image.value = result
}

function onReplace() {
  image.value = null
}

function onSave() {
  emits('finished', image.value)
  image.value = null
}

</script>

<template>
  <div class="modal modal-lg fade" :id="props.id" tabindex="-1" :aria-labelledby="props.id" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Selecciona una imagen</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="image" class="text-center">
            <img class="img-cropped" :src="image" alt=""><br/>
          </div>
          <ImageSelector @finished="onImageSelected" v-else/>
        </div>
        <div class="modal-footer" v-if="image">
          <button class="btn btn-light" @click.prevent="onReplace">Reemplazar imagen</button>
          <button class="btn btn-primary" type="button" data-bs-dismiss="modal" aria-label="Close"
                  @click="onSave">
            Terminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-cropped {
  max-width: 300px;
}
</style>